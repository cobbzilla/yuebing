import {
  GetObjectCommand, HeadObjectCommand, ListObjectsCommand, PutObjectCommand, DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

const fs = require('fs')
const nuxt = require('../../nuxt.config').default
const m = require('../../shared/media')
const redis = require('../util/redis')
const util = require('../util/file')
const s3cfg = require('./s3client.js')

const CACHE_PREFIX = 'CACHED_S3_LIST_SOURCE_'
const LIST_CACHE_EXPIRATION = nuxt.privateRuntimeConfig.redis.listingCacheExpiration

async function listDest (prefix) {
  const client = s3cfg.destClient
  const params = s3cfg.destBucketParams
  return await listObjects(prefix, client, params)
}

async function listSource (prefix, recursive = false) {
  const client = s3cfg.sourceClient
  const params = s3cfg.sourceBucketParams

  const cacheKey = CACHE_PREFIX + prefix
  const cachedListing = await redis.get(cacheKey)
  if (cachedListing) {
    return JSON.parse(cachedListing)
  }

  const results = await listObjects(prefix, client, params, recursive)
  await redis.set(cacheKey, JSON.stringify(results), LIST_CACHE_EXPIRATION)
  return results
}

async function listObjects (prefix, client, params, recursive = false) {
  const logPrefix = `listObjects(prefix=${prefix}):`

  // Declare truncated as a flag that the while loop is based on.
  let truncated = true

  const fullPrefix = prefix.startsWith(params.Prefix) ? prefix : params.Prefix + prefix
  const bucketParams = Object.assign({}, params, {
    Prefix: fullPrefix,
    Delimiter: recursive ? undefined : '/'
  })
  const objects = []
  console.log(`${logPrefix} fullPrefix = ${fullPrefix}, bucketParams=${JSON.stringify(bucketParams)}`)

  // Declare a variable to which the key of the last element is assigned to in the response.
  let pageMarker

  // while loop that runs until 'response.truncated' is false.
  while (truncated) {
    try {
      console.log(`${logPrefix} sending request with bucketParams=${JSON.stringify(bucketParams)}`)
      const response = await client.send(new ListObjectsCommand(bucketParams))
      console.log(`${logPrefix} >>>>>>>> listing returned : ${JSON.stringify(response)}`)
      if (typeof response.Contents !== 'undefined') {
        response.Contents.forEach((item) => {
          objects.push(m.newMediaObject(item.Key))
        })
      }
      if (typeof response.CommonPrefixes !== 'undefined') {
        response.CommonPrefixes.forEach((item) => {
          objects.push({
            name: item.Prefix,
            type: m.DIRECTORY_TYPE,
            mediaType: m.DIRECTORY_TYPE
          })
        })
      }
      truncated = response.IsTruncated
      // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
      if (truncated) {
        bucketParams.Marker = response.NextMarker
      }
      // At end of the list, response.truncated is false, and the function exits the while loop.
    } catch (err) {
      console.log(`${logPrefix} Error: ${err}`)
      truncated = false
    }
  }
  return objects
}

function normalizeDestKey (origKey) {
  const destPrefix = s3cfg.destBucketParams.Prefix
  const key = origKey.startsWith(destPrefix)
    ? origKey
    : destPrefix.endsWith('/')
      ? destPrefix + origKey
      : destPrefix + '/' + origKey
  return key
}

async function headSourceObject (key) {
  const params = Object.assign({}, s3cfg.sourceBucketParams, { Key: key })
  return await headObject(s3cfg.sourceClient, params)
}

async function headDestObject (key) {
  const params = Object.assign({}, s3cfg.destBucketParams, { Key: normalizeDestKey(key) })
  return await headObject(s3cfg.destClient, params)
}

async function headObject (client, bucketParams) {
  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await client.send(new HeadObjectCommand(bucketParams))
    // console.log(`headObject(${bucketParams.Key}) returned: ${JSON.stringify(data)}`)
    return data || true
  } catch (err) {
    console.log(`headObject(${bucketParams.Key}) error: ${err}`)
    return false
  }
}

async function downloadObjectToFile (client, bucketParams, file) {
  let stream = null
  try {
    const size = util.statSize(file)
    if (size > 0) {
      fs.truncateSync(file, 0)
    }
    stream = fs.createWriteStream(file)
    const handler = (chunk) => {
      stream.write(chunk, (err) => {
        if (err) {
          console.log(`downloadObjectToFile: error writing to ${file}: ${err}`)
          throw err
        }
      })
    }
    const closeHandler = () => stream.close((err) => {
      if (err) {
        console.log(`downloadObjectToFile: error closing file ${file}: ${err}`)
        throw err
      }
    })
    return await downloadObject(client, bucketParams, handler, closeHandler)
  } catch (err) {
    console.log(`downloadObjectToFile: ERROR: ${err}`)
    throw err
  }
}

async function streamDestObject (key, writeable, range = null) {
  const bucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: key })
  if (range) {
    console.log(`streamDestObject: set bucketParams.Range=${range}`)
    bucketParams.Range = range
  }
  const handler = chunk => writeable.write(chunk)
  return await downloadObject(s3cfg.destClient, bucketParams, handler)
}

async function readDestTextObject (key) {
  const newKey = normalizeDestKey(key)
  const bucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: newKey })
  let buffer = ''
  const handler = (chunk) => {
    buffer += chunk.toString()
  }
  await downloadObject(s3cfg.destClient, bucketParams, handler)
  return buffer
}

async function downloadObject (client, bucketParams, dataHandler, closeHandler = null) {
  // console.log(`downloadObject(${bucketParams.Bucket} / ${bucketParams.Key}, prefix=${bucketParams.Prefix}): STARTING`)
  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await client.send(new GetObjectCommand(bucketParams))
    const streamHandler = stream =>
      new Promise((resolve, reject) => {
        stream.on('data', dataHandler)
        stream.on('error', reject)
        stream.on('end', () => {
          if (closeHandler) {
            closeHandler()
          }
          resolve()
        })
      })
    await streamHandler(data.Body)
    return true
  } catch (err) {
    console.error(`downloadObject(${bucketParams.Key}, prefix=${bucketParams.Prefix}) ERROR: ${err}`)
    throw err
  }
}

async function uploadObject (bucketParams) {
  try {
    const uploader = new Upload({
      client: s3cfg.destClient,
      params: {
        Bucket: s3cfg.destBucketParams.Bucket,
        Key: bucketParams.Key,
        Body: bucketParams.Body
      },
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false // optional manually handle dropped parts
    })
    uploader.on('httpUploadProgress', (progress) => {
      console.log(`uploadObject(${bucketParams.Key}): ${progress}`)
    })
    await uploader.done()
    return true
  } catch (e) {
    console.error(`uploadObject(${bucketParams.Key}): ERROR ${e}`)
    return null
  }
}

async function putObject (bucketParams) {
  const client = s3cfg.destClient
  const origKey = bucketParams.Key
  try {
    const key = normalizeDestKey(origKey)
    const params = Object.assign({}, bucketParams, {
      Bucket: s3cfg.destBucketParams.Bucket,
      Prefix: '',
      Key: key
    })
    // console.log(`putObject(${origKey}): params=${JSON.stringify(params)}`)
    const data = await client.send(new PutObjectCommand(params))
    // console.log(`putObject(${origKey}): created object: ${params.Bucket}/${params.Key}`)
    return data || true
  } catch (err) {
    console.log(`putObject(${origKey}) error: ${err}`)
    return null
  }
}

function destPut (bucketParams, errorMessage) {
  putObject(bucketParams).then((result) => {
    if (typeof result === 'undefined') {
      console.warn(errorMessage)
    }
  })
}

async function deleteDestObject (destKey) {
  const key = destKey.startsWith(s3cfg.destBucketParams.Prefix) ? destKey : s3cfg.destBucketParams.Prefix + destKey
  try {
    const bucketParams = { Bucket: s3cfg.destBucketParams.Bucket, Key: key }
    const data = await s3cfg.destClient.send(new DeleteObjectCommand(bucketParams))
    console.log(`deleteDestObject: Object deleted: ${key} : ${JSON.stringify(data)}`)
    return data || true
  } catch (err) {
    console.log(`deleteDestObject: error deleting ${key}: ${err}`)
  }
}

function touchLastModified (sourcePath) {
  const path = util.canonicalDestDir(sourcePath) + util.LAST_MODIFIED_FILE
  const bucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: path, Body: '' + Date.now() })
  destPut(bucketParams, `touchLastModified: error writing ${path}`)
  console.log(`touchLastModified: touched: ${path}`)
}

function recordError (sourcePath, profile, error) {
  const path = util.canonicalDestDir(sourcePath) + util.ERROR_FILE_PREFIX + profile + '_' + Date.now()
  const bucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: path, Body: error })
  destPut(bucketParams, `touchError: error writing ${path}`)
  console.log(`recordError: recorded: ${path} = ${error}`)
}

async function countErrors (sourcePath, profile) {
  const files = await listDest(util.canonicalDestDir(sourcePath) + util.ERROR_FILE_PREFIX + profile)
  const count = files && files.length ? files.length : 0
  console.log(`countErrors(${sourcePath}, ${profile}) returning: ${count}`)
  return count
}

async function clearErrors (sourcePath, profile) {
  const prefix = util.canonicalDestDir(sourcePath) + util.ERROR_FILE_PREFIX + profile
  console.log(`clearErrors(${sourcePath}, ${profile}): looking for files with prefix: ${prefix}`)
  const files = await listDest(prefix)
  if (files && files.length ? files.length : 0) {
    files.forEach((file) => {
      console.log(`clearErrors(${sourcePath}, ${profile}): deleting: ${file.name}`)
      deleteDestObject(file.name)
    })
  }
}

export {
  listObjects, listDest, listSource,
  downloadObject, downloadObjectToFile, streamDestObject, readDestTextObject,
  headObject, headSourceObject, headDestObject,
  putObject, uploadObject, destPut, deleteDestObject,
  touchLastModified, recordError, countErrors, clearErrors
}
