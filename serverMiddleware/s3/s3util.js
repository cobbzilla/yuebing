import { GetObjectCommand, HeadObjectCommand, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const fs = require('fs')
const util = require('../util')
const s3cfg = require('./s3client.js')

async function listDest (prefix) {
  const client = s3cfg.destClient
  const params = s3cfg.destBucketParams
  return await listObjects(prefix, client, params, false)
}

async function listSource (prefix) {
  const client = s3cfg.sourceClient
  const params = s3cfg.sourceBucketParams
  return await listObjects(prefix, client, params, true)
}

async function listObjects (prefix, client, params, isSource) {
  // Declare truncated as a flag that the while loop is based on.
  let truncated = true

  const fullPrefix = params.Prefix + prefix
  const bucketParams = Object.assign({}, params, {
    Prefix: fullPrefix,
    Delimiter: '/'
  })
  const objects = []
  console.log('listing with prefix = ' + prefix + ', fullPrefix = ' + fullPrefix)

  // Declare a variable to which the key of the last element is assigned to in the response.
  let pageMarker

  // while loop that runs until 'response.truncated' is false.
  while (truncated) {
    try {
      const response = await client.send(new ListObjectsCommand(bucketParams))
      if (typeof response.Contents !== 'undefined') {
        response.Contents.forEach((item) => {
          if (util.isVideo(item.Key)) {
            objects.push({
              name: item.Key,
              type: 'file',
              video: true
            })
          } else {
            objects.push({
              name: item.Key,
              type: item.Key.endsWith('/') ? 'dir' : 'file'
            })
          }
        })
      }
      if (typeof response.CommonPrefixes !== 'undefined') {
        response.CommonPrefixes.forEach((item) => {
          objects.push({
            name: item.Prefix,
            type: 'dir'
          })
        })
      }
      // Log the key of every item in the response to standard output.
      truncated = response.IsTruncated
      // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
      if (truncated) {
        pageMarker = response.Contents.slice(-1)[0].Key
        // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
        bucketParams.Marker = pageMarker
      }
      // At end of the list, response.truncated is false, and the function exits the while loop.
    } catch (err) {
      console.log('Error', err)
      truncated = false
    }
  }
  return objects
}

async function getObject (client, bucketParams) {
  try {
    // Create a helper function to convert a ReadableStream to a string.
    const streamToString = stream =>
      new Promise((resolve, reject) => {
        const chunks = []
        stream.on('data', chunk => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      })

    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await client.send(new GetObjectCommand(bucketParams))
    const bodyContents = await streamToString(data.Body)
    console.log(bodyContents)
    return bodyContents
  } catch (err) {
    console.log('Error', err)
    return null
  }
}

async function headSourceObject (key) {
  const params = Object.assign({}, s3cfg.sourceBucketParams, { Key: key })
  return await headObject(s3cfg.sourceClient, params)
}

async function headDestObject (key) {
  const params = Object.assign({}, s3cfg.destBucketParams, { Key: key })
  return await headObject(s3cfg.destClient, params)
}

async function headObject (client, bucketParams) {
  try {
    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await client.send(new HeadObjectCommand(bucketParams))
    console.log('headObject returned: ' + JSON.stringify(data))
    return data
  } catch (err) {
    console.log('Error', err)
    return null
  }
}

async function downloadObject (client, bucketParams, file) {
  try {
    const size = util.statSize(file)
    if (size > 0) {
      fs.truncateSync(file, 0)
    }
    // Create a helper function to convert a ReadableStream to a string.
    const streamToFile = stream =>
      new Promise((resolve, reject) => {
        const chunks = []
        stream.on('data', (chunk) => {
          fs.appendFile(file, chunk, function (err) {
            if (err) {
              throw err
            }
          })
        })
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      })

    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await client.send(new GetObjectCommand(bucketParams))
    await streamToFile(data.Body)
    return true
  } catch (err) {
    console.log('Error', err)
    return false
  }
}

async function putObject (bucketParams) {
  const client = s3cfg.destClient
  try {
    const destPrefix = s3cfg.destBucketParams.Prefix
    const origKey = bucketParams.Key
    const key = origKey.startsWith(destPrefix)
      ? origKey
      : destPrefix.endsWith('/')
        ? destPrefix + origKey
        : destPrefix + '/' + origKey
    const params = Object.assign({}, bucketParams, {
      Bucket: s3cfg.destBucketParams.Bucket,
      Prefix: '',
      Key: key
    })
    console.log('putObject: params=' + JSON.stringify(params))
    const data = await client.send(new PutObjectCommand(params))
    console.log('Successfully uploaded object: ' + bucketParams.Bucket + '/' + bucketParams.Key)
    return data // For unit tests.
  } catch (err) {
    console.log('Error', err)
  }
}

function destPut (bucketParams, errorMessage) {
  putObject(bucketParams).then((result) => {
    if (typeof result === 'undefined') {
      console.warn(errorMessage)
    }
  })
}

function touchLastModified (sourcePath) {
  const path = util.canonicalDestDir(sourcePath) + util.LAST_MODIFIED_FILE
  const bucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: path, Body: '' + Date.now() })
  destPut(bucketParams, 'touchLastModified: error writing ' + path)
  console.log('touchLastModified: touched: ' + path)
}

function recordError (sourcePath, type, profile, error) {
  const path = util.canonicalDestDir(sourcePath) + util.ERROR_FILE_PREFIX + type + '_' + profile + '_' + Date.now()
  const bucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: path, Body: error })
  destPut(bucketParams, 'touchError: error writing ' + path)
  console.log('touchError: touched: ' + path)
}

async function countErrors (sourcePath, type, profile) {
  const files = await listDest(util.canonicalDestDir(sourcePath) + util.ERROR_FILE_PREFIX + type + '_' + profile)
  return files && files.length ? files.length : 0
}

export {
  listObjects, listDest, listSource, getObject, downloadObject,
  headObject, headSourceObject, headDestObject, putObject, destPut,
  touchLastModified, recordError, countErrors
}
