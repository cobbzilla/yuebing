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
const MIN_VALID_TRANSCODE_SIZE = 1024 * 256 // 256k min valid size
const MIN_VALID_THUMBNAIL_SIZE = 1024 // 1k min valid size

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

async function putObject (client, bucketParams) {
  try {
    const data = await client.send(new PutObjectCommand(bucketParams))
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
  const canonical = sha.substring(0, 2) +
    '/' + sha.substring(2, 4) +
    '/' + sha.substring(6, 6) +
    '/' + (scrubbed.length < 20 ? scrubbed : scrubbed.substring(0, 20)) + '_' + sha +
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
  putObject(s3cfg.destClient, bucketParams)
    .then((result) => {
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
    const destKey = s3cfg.destBucketParams.Prefix + '/' + canonicalDestDir(sourcePath) + path.basename(outfile)

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
    args.push(outfile)
    console.log('running ffmpeg transcode with args: ' + JSON.stringify(args))
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
      } else {
        // stat the outfile -- it should be at least a minimum size
        const outfileSize = statSize(outfile)
        if (outfileSize < MIN_VALID_TRANSCODE_SIZE) {
          // write an error file
          console.warn('outfile had error (min size not met): ' + outfile)
          const errorKey = path.dirname(destKey) + 'error_' + path.basename(destKey) + '_' + Date.now()
          destPut(Object.assign({}, metaBucketParams, { Key: errorKey, Body: '' }),
            'error writing error marker file: ' + errorKey)
        } else {
          // file is OK, we can upload it to dest
          const fileUp = fs.createReadStream(outfile)
          destPut(Object.assign({}, metaBucketParams, { Key: destKey, Body: fileUp }),
            'error uploading transcoded file: ' + outfile)
          // ensure it was uploaded
          headObject(destClient, metaBucketParams, { Key: destKey }).then((head) => {
            if (head && head.ContentLength && head.ContentLength === outfileSize) {
              // upload success!
            } else {
              console.error('error uploading thumbnail (size mismatch): ' + outfile)
            }
          })
        }
      }
    })
  }

  for (const name in thumbnails) {
    const profile = thumbnails[name]
    const outfiles = path.dirname(localSourceFile) + '/thumbnail_' + name + '_%03d.jpg'

    const args = []
    args.push('-i')
    args.push(localSourceFile)
    args.push('-vf')
    args.push('fps=' + profile.fps)
    args.push(outfiles)

    console.log('running ffmpeg thumbnails with args: ' + JSON.stringify(args))
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
      } else {
        // find the outfiles -- we should have at least one with size > 16k
        glob(path.dirname(outfiles), (err, files) => {
          if (err) {
            console.error('Error listing thumbnails: ' + err)
          } else {
            // Check to see that they are all the right size
            let allOk = true
            files.forEach((file) => {
              if (statSize(file) < MIN_VALID_THUMBNAIL_SIZE) {
                console.error('Error, thumbnail file was too small: ' + file)
                allOk = false
              }
            })
            if (allOk) {
              // OK, upload all the thumbnails
              files.forEach((file) => {
                const fileUp = fs.createReadStream(file)
                const destKey = s3cfg.destBucketParams.Prefix + '/' + canonicalDestDir(sourcePath) + path.basename(file)
                destPut(Object.assign({}, metaBucketParams, { Key: destKey, Body: fileUp }),
                  'error uploading thumbnail: ' + file)
                // ensure it was uploaded
                headObject(destClient, metaBucketParams, { Key: destKey }).then((head) => {
                  if (head && head.ContentLength && head.ContentLength === statSize(file)) {
                    // upload success!
                  } else {
                    console.error('error uploading thumbnail (size mismatch): ' + file)
                  }
                })
              })
            }
          }
        })
      }
    })
  }
}

function statSize (file) {
  let size
  fs.stat(file, (err, stats) => {
    if (err) {
      size = -1
    } else if (stats && stats.size) {
      size = stats.size
    } else {
      size = -1
    }
  })
  return size
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
    const metaPath = s3cfg.destBucketParams.Prefix + '/' + canonicalDestDir(sourcePath) + '.meta'
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
    await putObject(s3cfg.destClient, putMetaParams)

    // set a timeout to read the file back in 10 seconds,
    // if the file has our same serverId in it, we begin the transformation jobs
    setTimeout(() => {
      verifySameMetaMaybeStartProcessing(sourcePath, metaBucketParams)
    }, 10000)

    return { processed: false }
  }

}

export { transformer }
