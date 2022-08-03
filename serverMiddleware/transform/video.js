import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const { spawn } = require('node:child_process')

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shasum = require('shasum')
const s3cfg = require('../s3/s3client.js')
const nuxt = require('../../nuxt.config')

export const workbenchDir = process.env.SV_WORK_DIR.endsWith('/')
  ? process.env.SV_WORK_DIR
  : process.env.SV_WORK_DIR + '/'

const PROCESSING_TIMEOUT = 1000 * 60 * 60 * 4 // 4 hours
const PROCESSING_MAX_ERRORS = 3
const MIN_VALID_TRANSCODE_SIZE = 1024 * 128 // 128k min valid size
const MIN_VALID_THUMBNAIL_SIZE = 64 // 64 bytes min valid size

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
    if (statSize(file) > 0) {
      console.log('downloadObject: file exists, truncating: ' + file)
      fs.truncateSync(file, 0)
      console.log('downloadObject: file exists, AFTER truncating (' + file + '), statSize=' + statSize(file))
    } else {
      console.log('downloadObject: file does not exist or size is zero: ' + file)
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
    const params = Object.assign({}, bucketParams, { Bucket: s3cfg.destBucketParams.Bucket, Prefix: '', Key: key })
    console.log('putObject: params=' + JSON.stringify(params))
    const data = await client.send(new PutObjectCommand(params))
    console.log('Successfully uploaded object: ' + bucketParams.Bucket + '/' + bucketParams.Key)
    return data // For unit tests.
  } catch (err) {
    console.log('Error', err)
  }
}

function canonicalWorkingDir (path) {
  // replace all nonalphanumeric chars with underscores
  const scrubbed = path.replace(/[\W_]+/g, '_')
  // retain the first 20 characters, then add a hash
  const canonical = (scrubbed.length < 20 ? scrubbed : scrubbed.substring(0, 20)) + '_' + shasum(path) + '/'
  console.log('canonicalWorkingDir(' + path + ') returning ' + canonical)
  return canonical
}

function canonicalDestDir (path) {
  // replace all nonalphanumeric chars with underscores
  const scrubbed = path.replace(/[\W_]+/g, '_')
  // retain the first 20 characters, then add a hash
  const sha = shasum(path)
  const rawPrefix = s3cfg.destBucketParams.Prefix
  const prefix = rawPrefix.endsWith('/') ? rawPrefix : rawPrefix + '/'
  const slug = (scrubbed.length < 20 ? scrubbed : scrubbed.substring(0, 20)) + '_' + sha
  const canonical = prefix + sha.substring(0, 2) +
    '/' + sha.substring(2, 4) +
    '/' + sha.substring(4, 6) +
    '/' + slug +
    '/'
  console.log('canonicalDestDir(' + path + ') returning ' + canonical)
  return canonical
}

function canonicalSourceFile (path) {
  const base = path.endsWith('/') ? path.substring(0, path.length - 1) : path
  const slash = base.lastIndexOf('/')
  const file = slash === -1 ? base : base.substring(slash)
  const dot = file.lastIndexOf('.')
  const ext = dot === -1 || dot === file.length - 1 ? '' : file.substring(dot + 1)
  const canonical = 'source.' + ext
  console.log('canonicalSourceFile(' + path + ') returning ' + canonical)
  return canonical
}

function destPut (bucketParams, errorMessage) {
  putObject(bucketParams).then((result) => {
    if (typeof result === 'undefined') {
      console.warn(errorMessage)
    }
  })
}

function prepareArtifacts (sourcePath, localSourceFile, meta, metaBucketParams) {
  console.log('prepareArtifacts starting with file: ' + localSourceFile)

  const destClient = s3cfg.destClient
  const videoConfig = nuxt.default.privateRuntimeConfig.transform.video
  const videoDefaults = videoConfig.default
  const profiles = videoConfig.profiles
  const thumbnails = videoConfig.thumbnails
  if (typeof meta.transforms === 'undefined') {
    meta.transforms = []
  }

  for (const name in profiles) {
    const profile = profiles[name]
    const prof = Object.assign(videoDefaults, profile)
    const outfile = path.dirname(localSourceFile) + '/transcode_' + name + '.' + prof.ext
    const destKey = canonicalDestDir(sourcePath) + path.basename(outfile)

    const args = []
    args.push('-i')
    args.push(localSourceFile)
    args.push('-vcodec')
    args.push(prof.videoCodec)
    args.push('-s')
    args.push(prof.videoSize)
    args.push('-r')
    args.push(prof.frameRate)
    args.push('-b:v')
    args.push(prof.videoBitrate)
    args.push('-acodec')
    args.push(prof.audioCodec)
    args.push('-ac')
    args.push(prof.audioChannels)
    args.push('-ar')
    args.push(prof.audioRate)
    args.push('-b:a')
    args.push(prof.audioBitrate)
    args.push('-y')
    args.push(outfile)
    console.log('running ffmpeg transcode: ffmpeg ' + args.join(' '))
    const ffmpeg = spawn('ffmpeg', args)
    let result = ''
    ffmpeg.stdout.on('data', (data) => {
      console.log(`stdout >>>>>> ${data}`)
      result = result + data
    })

    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr >>>>>> ${data}`)
    })

    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        console.warn(`child process exited with code ${code}`)
        fs.unlink(outfile, () => {})
      } else {
        // stat the outfile -- it should be at least a minimum size
        const outfileSize = statSize(outfile)
        if (outfileSize < MIN_VALID_TRANSCODE_SIZE) {
          fs.unlink(outfile, () => {})
          // write an error file
          console.warn('outfile had error (min size not met): ' + outfile)
          const errorKey = canonicalDestDir(sourcePath) + 'error_' + path.basename(destKey) + '_' + Date.now()
          destPut(Object.assign({}, metaBucketParams, { Key: errorKey, Body: '' }),
            'error writing error marker file: ' + errorKey)
        } else {
          // file is OK, we can upload it to dest
          const fileUp = fs.createReadStream(outfile)
          console.log('starting upload of transcoded file: ' + outfile + ' to destKey=' + destKey)
          destPut(Object.assign({}, metaBucketParams, { Key: destKey, Body: fileUp }),
            'error uploading transcoded file: ' + outfile + ' to destKey=' + destKey)
          // ensure it was uploaded
          headObject(destClient, metaBucketParams, { Key: destKey }).then((head) => {
            if (head && head.ContentLength && head.ContentLength === outfileSize) {
              // upload success!
            } else {
              console.error('error uploading transcoded file (size mismatch): ' + outfile + ' head=' + JSON.stringify(head))
            }
          })
        }
      }
    })
  }

  for (const name in thumbnails) {
    const profile = thumbnails[name]
    const outfilePrefix = path.dirname(localSourceFile) + '/thumbnail_' + name + '_'
    const outfiles = outfilePrefix + '%03d.jpg'

    const args = []
    args.push('-i')
    args.push(localSourceFile)
    args.push('-vf')
    args.push('fps=' + profile.fps)
    args.push('-y')
    args.push(outfiles)

    console.log('running ffmpeg thumbnails: ffmpeg ' + args.join(' '))
    const ffmpeg = spawn('ffmpeg', args)
    let result = ''
    ffmpeg.stdout.on('data', (data) => {
      console.log(`stdout >>>>>> ${data}`)
      result = result + data
    })

    ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr >>>>>> ${data}`)
    })

    ffmpeg.on('close', (code) => {
      const deleteFiles = code !== 0
      if (deleteFiles) {
        console.warn(`ffmpeg thumbnails for ${name} exited with code ${code}`)
      } else {
        console.log(`ffmpeg thumbnails for ${name} completed OK`)
      }
      // find the outfiles -- we should have at least one with size > 16k
      glob(outfilePrefix + '*', (err, files) => {
        console.log(`glob matched:\n${files.join('\n')}`)
        if (err) {
          console.error('Error listing thumbnails: ' + err)
        } else {
          let allOk = !deleteFiles
          if (!deleteFiles) {
            files.forEach((file) => {
              const size = statSize(file)
              if (size < MIN_VALID_THUMBNAIL_SIZE) {
                console.error(`Error, thumbnail file was too small (${size}): ${file}`)
                allOk = false
              }
            })
          }
          if (allOk) {
            // OK, upload all the thumbnails
            files.forEach((file) => {
              const fileUp = fs.createReadStream(file)
              const destKey = canonicalDestDir(sourcePath) + path.basename(file)
              console.log('uploading thumbnail ' + file + ' to destKey=' + destKey)
              destPut(Object.assign({}, metaBucketParams, { Key: destKey, Body: fileUp }),
                'error uploading thumbnail: ' + file)
              // ensure it was uploaded
              headObject(destClient, metaBucketParams, { Key: destKey }).then((head) => {
                if (head && head.ContentLength && head.ContentLength === statSize(file)) {
                  // upload success!
                } else {
                  console.error('error uploading thumbnail (size mismatch): ' + file + ' head=' + JSON.stringify(head))
                }
              })
            })
          } else {
            console.warn('thumbnails failed for name ' + name + ', deleting files...')
            files.forEach((file) => {
              console.warn('Deleting failed thumbnail: ' + file)
              fs.unlink(file, () => {})
            })
          }
        }
      })
    })
  }
}

function statSize (file) {
  const stats = fs.statSync(file, { throwIfNoEntry: false })
  if (stats && stats.size) {
    return stats.size
  }
  console.error('statSize error on file ' + file)
  return -1
}

async function verifySameMetaMaybeStartProcessing (sourcePath, metaBucketParams) {
  const destMeta = await getObject(s3cfg.destClient, metaBucketParams)
  if (typeof destMeta === 'string') {
    const meta = JSON.parse(destMeta)
    const serverId = nuxt.default.privateRuntimeConfig.serverId
    if (meta && meta.owner && meta.owner === serverId && meta.processed === false) {
      // OK -- we are processing

      // Does the local copy of the source exist already?
      const file = workbenchDir + canonicalWorkingDir(sourcePath) + canonicalSourceFile(sourcePath)
      const size = statSize(file)
      console.log('found file.size = ' + size + ' for file ' + file)

      const sourceBucketParams = Object.assign({}, s3cfg.sourceBucketParams, { Key: sourcePath })

      let downloadSource = true
      if (size !== -1) {
        // we have a file with some size. do a HEAD request for the source
        // we might already have the whole file
        const head = await headObject(s3cfg.sourceClient, sourceBucketParams)
        if (head && head.ContentLength && head.ContentLength === size) {
          console.log('We already have the file, we can skip downloading')
          downloadSource = false
        }
      }

      if (downloadSource) {
        console.log('downloading source to file: ' + file)
        fs.mkdirSync(path.dirname(file), { recursive: true })
        await downloadObject(s3cfg.sourceClient, sourceBucketParams, file)
      }
      prepareArtifacts(sourcePath, file, meta, metaBucketParams)
    } else {
      console.log('verifySameMetaMaybeStartProcessing: meta owner changed or processing completed: ' + metaBucketParams.Key)
    }
  } else {
    console.warn('verifySameMetaMaybeStartProcessing: meta file disappeared: ' + metaBucketParams.Key)
  }
}

const transformer = {

  /* eslint-disable */
  transform: async (sourcePath) => {
    console.log('transform(' + sourcePath + ')')
    const serverId = nuxt.default.privateRuntimeConfig.serverId
    const metaPath = canonicalDestDir(sourcePath) + '.meta'
    const metaBucketParams = Object.assign({}, s3cfg.destBucketParams, { Key: metaPath })
    const destMeta = await getObject(s3cfg.destClient, metaBucketParams)
    let meta = null
    if (typeof destMeta === 'string') {
      // metafile exists. if processing is completed, return the metadata
      console.log('>>>>> read meta file: ' + destMeta)
      meta = JSON.parse(destMeta)
      if (meta.processed === true) {
        return meta
      }

      // if processed is not true, then it may either be:
      // * currently processing, in which case we do not want to disturb it or start new processing
      // * processing that errored-out, in which case we want to retry
      // * if processing has had too many errors, we should give up

      // we consider something currently processing if either we own it, or it
      // has been processing for less than 4 hours
      if ((meta.owner && meta.owner === serverId) || (meta.ctime && Date.now() - meta.ctime < PROCESSING_TIMEOUT)) {
        console.log('>>>>> meta owner (' + meta.owner + ') is same (' + serverId + ') or file is young, returning as-is')
        return meta
      }

      if (meta.errors && meta.errors > PROCESSING_MAX_ERRORS) {
        console.log('>>>>> meta had a lot of errors, just returning as-is')
        return meta
      }

      // OK, we have to process it
      console.log('>>>>> meta should be processed!!!! woo woo')
    }

    // write meta file
    // console.log('NUXT = ' + JSON.stringify(nuxt))
    let metaBody
    if (meta !== null) {
      // retain all existing metadata fields by only overwriting what we need to
      meta.processed = false
      meta.mtime = Date.now()
      meta.owner = serverId
    } else {
      // creating a fresh new metadata
      meta = {
        processed: false,
        ctime: Date.now(),
        mtime: Date.now(),
        owner: serverId
      }
    }
    metaBody = JSON.stringify(meta)
    const putMetaParams = Object.assign({}, metaBucketParams, { Body: metaBody })
    destPut(putMetaParams)

    // set a timeout to read the file back in 10 seconds,
    // if the file has our same serverId in it, we begin the transformation jobs
    setTimeout(() => {
      verifySameMetaMaybeStartProcessing(sourcePath, metaBucketParams)
    }, 10000)

    return { processed: false }
  }

}

export { transformer }
