const { spawn } = require('node:child_process')

const fs = require('fs')
const path = require('path')
const Queue = require('bull')
const glob = require('glob')
const nuxt = require('../../nuxt.config')
const s3cfg = require('../s3/s3client.js')
const s3util = require('../s3/s3util')
const util = require('../util')
const manifest = require('./manifest')

const MIN_VALID_TRANSCODE_SIZE = 1024 * 128 // 128k min valid size
const MIN_VALID_THUMBNAIL_SIZE = 64 // 64 bytes min valid size
const MAX_XFORM_ERRORS = 3

async function createArtifacts (sourcePath, localSourceFile) {
  console.log('createArtifacts starting with file: ' + localSourceFile)

  const destBucketParams = s3cfg.destBucketParams
  const videoConfig = nuxt.default.privateRuntimeConfig.transform.video
  const videoDefaults = videoConfig.default
  const profiles = videoConfig.profiles
  const thumbnails = videoConfig.thumbnails

  for (const name in profiles) {
    const profile = profiles[name]
    const prof = Object.assign(videoDefaults, profile)
    const outfile = path.dirname(localSourceFile) + '/' + util.XFORM_TRANSCODE_PREFIX + name + '.' + prof.ext
    const destKey = util.canonicalDestDir(sourcePath) + path.basename(outfile)

    const destHead = await s3util.headDestObject(destKey)
    if (destHead && destHead.ContentLength && destHead.ContentLength > MIN_VALID_TRANSCODE_SIZE) {
      console.log(`createArtifacts: artifact ${path.basename(destKey)} exists for profile ${name} (skipping) for source ${sourcePath}`)
      continue
    }
    const errCount = await s3util.countErrors(sourcePath, util.XFORM_TRANSCODE_PREFIX, name)
    if (errCount > MAX_XFORM_ERRORS) {
      console.warn(`createArtifacts: transcoding artifact for profile ${name} has failed too many times (${MAX_XFORM_ERRORS}) for ${sourcePath}, giving up`)
      continue
    }

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
        const message = `child process exited with code ${code}`
        console.warn(message)
        util.deleteFile(outfile)
        s3util.recordError(sourcePath, util.XFORM_TRANSCODE_PREFIX, name, message)
      } else {
        // stat the outfile -- it should be at least a minimum size
        const outfileSize = util.statSize(outfile)
        if (outfileSize < MIN_VALID_TRANSCODE_SIZE) {
          util.deleteFile(outfile)
          const message = `transcode for ${name} profile had error (min size ${MIN_VALID_TRANSCODE_SIZE} not met) for outfile ${outfile}`
          console.warn(message)
          s3util.recordError(sourcePath, util.XFORM_TRANSCODE_PREFIX, name, message)
        } else {
          // file is OK, we can upload it to dest
          const fileUp = fs.createReadStream(outfile)
          console.log('starting upload of transcoded file: ' + outfile + ' to destKey=' + destKey)
          s3util.destPut(Object.assign({}, destBucketParams, { Key: destKey, Body: fileUp }),
            'error uploading transcoded file: ' + outfile + ' to destKey=' + destKey)
          // ensure it was uploaded
          s3util.headDestObject(destKey)
            .then((head) => {
              if (head && head.ContentLength && head.ContentLength === outfileSize) {
                // upload success!
                console.log('successfully uploaded transcoded file: ' + outfile + ' to destKey=' + destKey)
                s3util.touchLastModified(sourcePath)
              } else {
                // todo: should we delete the destination file and record an error here?
                console.error('error uploading transcoded file (size mismatch): ' + outfile + ' head=' + JSON.stringify(head))
              }
            })
        }
      }
    })
  }

  for (const name in thumbnails) {
    const profile = thumbnails[name]
    const outfilePrefix = path.dirname(localSourceFile) + '/' + util.XFORM_THUMBNAIL_PREFIX + name + '_'
    const outfiles = outfilePrefix + '%03d.jpg'

    const firstThumbnailKey = util.canonicalDestDir(sourcePath) + util.XFORM_THUMBNAIL_PREFIX + name + '_001.jpg'
    console.log(`createArtifacts: looking for firstThumbnailKey=${firstThumbnailKey}`)
    const destHead = await s3util.headDestObject(firstThumbnailKey)
    if (destHead && destHead.ContentLength && destHead.ContentLength > MIN_VALID_THUMBNAIL_SIZE) {
      console.log(`createArtifacts: artifact ${path.basename(firstThumbnailKey)} exists for profile ${name} (skipping) for source ${sourcePath}`)
      continue
    }
    const errCount = await s3util.countErrors(sourcePath, util.XFORM_THUMBNAIL_PREFIX, name)
    if (errCount > MAX_XFORM_ERRORS) {
      console.warn(`createArtifacts: thumbnail artifact(s) for profile ${name} failed too many times (${MAX_XFORM_ERRORS}) for ${sourcePath}, giving up`)
      continue
    }

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
      let errorRecorded = false
      if (deleteFiles) {
        const message = `ffmpeg thumbnails for ${name} exited with code ${code}`
        console.warn(message)
        s3util.recordError(sourcePath, util.XFORM_THUMBNAIL_PREFIX, name, message)
        errorRecorded = true
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
              const size = util.statSize(file)
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
              const destKey = util.canonicalDestDir(sourcePath) + path.basename(file)
              console.log('uploading thumbnail ' + file + ' to destKey=' + destKey)
              s3util.destPut(Object.assign({}, destBucketParams, { Key: destKey, Body: fileUp }),
                'error uploading thumbnail: ' + file)
              // ensure it was uploaded
              s3util.headDestObject(destKey).then((head) => {
                if (head && head.ContentLength && head.ContentLength === util.statSize(file)) {
                  // upload success!
                  s3util.touchLastModified(sourcePath)
                } else {
                  const message = `error uploading thumbnail (size mismatch): ${file} head=${JSON.stringify(head)}`
                  console.error(message)
                  if (!errorRecorded) {
                    s3util.recordError(sourcePath, XFORM_THUMBNAIL_PREFIX, name, message)
                    errorRecorded = true
                  }
                }
              })
            })
          } else {
            console.warn('thumbnails failed for name ' + name + ', deleting files...')
            files.forEach((file) => {
              console.warn('Deleting failed thumbnail: ' + file)
              util.deleteFile(file)
            })
            if (!errorRecorded) {
              s3util.recordError(sourcePath, XFORM_THUMBNAIL_PREFIX, name, 'thumbnails failed for name ' + name)
              errorRecorded = true
            }
          }
        }
      })
    })
  }
}

async function ensureSourceDownloaded (sourcePath) {
  // Does the local copy of the source exist already?
  const file = util.workbenchDir + util.canonicalWorkingDir(sourcePath) + util.canonicalSourceFile(sourcePath)
  const size = util.statSize(file)
  console.log('found file.size = ' + size + ' for file ' + file)

  const sourceBucketParams = Object.assign({}, s3cfg.sourceBucketParams, { Key: sourcePath })
  let downloadSource = true
  if (size !== -1) {
    // we have a file with some size. do a HEAD request for the source
    // we might already have the whole file
    const head = await s3util.headSourceObject(sourcePath)
    if (head && head.ContentLength && head.ContentLength === size) {
      console.log('We already have the file, we can skip downloading')
      downloadSource = false
    }
  }

  if (downloadSource) {
    console.log('downloading source to file: ' + file)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    await s3util.downloadObject(s3cfg.sourceClient, sourceBucketParams, file)
    const downloadSize = util.statSize(file)
    const head = await s3util.headSourceObject(sourcePath)
    if (head && head.ContentLength && head.ContentLength === downloadSize) {
      console.log('successfully downloaded complete source file: ' + file)
    } else {
      console.error('downloaded file ' + file + ' (size=' + downloadSize + ') which does not match source size: ' + head.ContentLength)
      util.deleteFile(file)
      return null
    }
  }
  return file
}

const videoQueue = new Queue('video transcoding', 'redis://127.0.0.1:6379')
const VIDEO_QUEUE_NAME = 'video-transforms'

videoQueue.process(VIDEO_QUEUE_NAME, util.MAX_CONCURRENT_TRANSFORMS, (job, done) => {
  console.log('videoQueue.process starting with job: ' + JSON.stringify(job))
  const sourcePath = job.data.sourcePath
  ensureSourceDownloaded(sourcePath).then((file) => {
    if (file) {
      createArtifacts(sourcePath, file)
      done()
    }
  })
})

async function transform (sourcePath) {
  console.log('transform(' + sourcePath + ')')
  const derivedMeta = await manifest.deriveMetadata(sourcePath)
  if (derivedMeta && derivedMeta.status && derivedMeta.status.complete) {
    return derivedMeta
  }
  console.log('added to videoQueue: ' + sourcePath)
  videoQueue.add(VIDEO_QUEUE_NAME, { sourcePath })
  return derivedMeta
}

export { transform }
