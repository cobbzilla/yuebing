import { spawn } from 'node:child_process'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
const s3util = require('../s3/s3util')
const util = require('../util')
const c = require('../../media')

const DEFAULT_FIRST_THUMBNAIL_OFFSET = '5.0'

function ffmpeg (args, closeHandler) {
  const ffmpeg = spawn('ffmpeg', args)
  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout >>>>>> ${data}`)
  })

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr >>>>>> ${data}`)
  })

  ffmpeg.on('close', code => closeHandler(code))
}

function multifilePrefix (outfile) {
  const placeholder = outfile.lastIndexOf(util.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    console.error(`deleteLocalOutfiles: expected to find placeholder (${util.MULTIFILE_PLACEHOLDER}) in outfile: ${outfile}`)
    return
  }
  return outfile.substring(0, placeholder)
}

function deleteLocalOutfiles (outfile, profile) {
  if (profile.multiFile) {
    const outfilePrefix = multifilePrefix(outfile)
    glob(outfilePrefix + '*', (err, files) => {
      if (err) {
        console.error(`deleteLocalOutfiles: glob error: ${err}`)
        return
      }
      files.forEach((f) => {
        util.deleteFile(f)
      })
    })
  } else {
    util.deleteFile(outfile)
  }
}

async function uploadAsset (sourcePath, outfile) {
  const outfileSize = util.statSize(outfile)
  const destKey = util.canonicalDestDir(sourcePath) + path.basename(outfile)
  const fileUp = fs.createReadStream(outfile)
  console.log(`uploadAsset(${destKey}): uploading asset ${outfile} to destKey=${destKey}`)
  if (await s3util.putObject(Object.assign({}, { Key: destKey, Body: fileUp })) == null) {
    const message = `uploadAsset(${destKey}): error uploading asset (upload failed)`
    console.error(message)
    await s3util.deleteDestObject(destKey)
    return message
  } else {
    // ensure it was uploaded
    const head = await s3util.headDestObject(destKey)
    if (head && head.ContentLength && head.ContentLength === outfileSize) {
      // upload success!
      console.log(`'uploadAsset(${destKey}): uploaded ${outfile} to destKey=${destKey}`)
      s3util.touchLastModified(sourcePath)
      return null
    } else {
      const message = `uploadAsset(${destKey}): error uploading asset (size mismatch): ${outfile} = ${outfileSize}, head=${JSON.stringify(head)}`
      console.error(message)
      await s3util.deleteDestObject(destKey)
      return message
    }
  }
}

function handleOutfiles (sourcePath, profile, outfile) {
  return async (code) => {
    console.log(`handleOutfiles(${profile.name}, ${sourcePath}): starting with outfile ${outfile} and ffmpeg exit code ${code}`)
    if (code !== 0) {
      const message = `handleOutfiles(${profile.name}, ${sourcePath}): child process exited with code ${code}`
      console.warn(message)
      deleteLocalOutfiles(outfile, profile)
      s3util.recordError(sourcePath, profile.name, message)
      return
    }

    if (profile.multiFile) {
      const outfilePrefix = multifilePrefix(outfile)
      let errorMessage = null
      let multifiles = null
      glob(outfilePrefix + '*', (err, files) => {
        if (err) {
          const message = `handleOutfiles(${profile.name}, ${sourcePath}): Error listing multifiles: ${err}`
          console.error(message)
          errorMessage = message
        } else {
          multifiles = files
        }
      })
      if (multifiles == null || typeof multifiles.length === 'undefined' || multifiles.length === 0) {
        errorMessage = `handleOutfiles(${profile.name}, ${sourcePath}): No multifiles found for outfile ${outfile} with prefix ${outfilePrefix}`
        console.error(errorMessage)
      }
      if (errorMessage === null) {
        const minSize = c.minFileSize(sourcePath, profile.operation)
        multifiles.every((file) => {
          const size = util.statSize(file)
          const sizeOk = size >= minSize
          if (!sizeOk) {
            const message = `handleOutfiles(${profile.name}, ${sourcePath}): asset file was too small (${size} < ${minSize}): ${file}`
            console.error(message)
            errorMessage = message
          }
          return sizeOk
        })
      }
      if (errorMessage === null) {
        // OK, upload all the thumbnails
        for (let i = 0; i < multifiles.length; i++) {
          const f = multifiles[i]
          const msg = await uploadAsset(sourcePath, f)
          if (msg != null) {
            errorMessage = msg
            break
          }
        }
      }
      if (errorMessage !== null) {
        console.error(errorMessage)
        deleteLocalOutfiles(outfile, profile)
        s3util.recordError(sourcePath, profile.name, errorMessage)
      }
    } else {
      // stat the outfile -- it should be at least a minimum size
      const outfileSize = util.statSize(outfile)
      const minAssetSize = c.minFileSize(sourcePath, profile.operation)
      if (outfileSize < minAssetSize) {
        util.deleteFile(outfile)
        const message = `handleOutfiles(${profile.name}, ${sourcePath}): profile/operation ${profile.name}/${profile.operation} (min size ${minAssetSize} not met) for outfile ${outfile}`
        console.warn(message)
        s3util.recordError(sourcePath, profile.name, message)
      } else {
        // file is OK, we can upload it to dest
        const msg = await uploadAsset(sourcePath, outfile)
        if (msg != null) {
          console.error(msg)
          s3util.recordError(sourcePath, profile.name, msg)
        }
      }
    }
  }
}

function transcode (sourcePath, sourceFile, profile, outfile) {
  const args = []
  args.push('-i')
  args.push(sourceFile)
  args.push('-vcodec')
  args.push(profile.videoCodec)
  args.push('-s')
  args.push(profile.videoSize)
  args.push('-r')
  args.push(profile.frameRate)
  args.push('-b:v')
  args.push(profile.videoBitrate)
  args.push('-acodec')
  args.push(profile.audioCodec)
  args.push('-ac')
  args.push(profile.audioChannels)
  args.push('-ar')
  args.push(profile.audioRate)
  args.push('-b:a')
  args.push(profile.audioBitrate)
  args.push('-y')
  args.push(outfile)
  return args
}

function thumbnails (sourcePath, sourceFile, profile, outfile) {
  const args = []
  args.push('-i')
  args.push(sourceFile)
  args.push('-s')
  args.push(profile.size)
  args.push('-vf')
  args.push('fps=' + profile.fps)
  args.push('-y')
  args.push(outfile)
  return args
}

function firstThumbnail (sourcePath, sourceFile, profile, outfile) {
  const offset = profile.offset && profile.offset > 0 ? profile.offset : DEFAULT_FIRST_THUMBNAIL_OFFSET
  const args = []
  args.push('-ss')
  args.push('' + offset)
  args.push('-accurate_seek')
  args.push('-i')
  args.push(sourceFile)
  args.push('-s')
  args.push(profile.size)
  args.push('-frames:v')
  args.push('1')
  args.push('-y')
  args.push(outfile)
  return args
}

function transform (sourcePath, file, profile, outfile) {
  console.log(`video:transform(${sourcePath}, ${file}, ${profile.name}) starting with outfile ${outfile}`)
  if (typeof profile.operation === 'undefined') {
    console.log(`video:transform(${sourcePath}, ${file}, ${JSON.stringify(profile)}) no operation defined on profile, skipping`)
    return
  }

  let args
  switch (profile.operation) {
    case 'transcode':
      console.log(`video:transform(${sourcePath}, ${file}, ${JSON.stringify(profile)}): starting transcode with outfile: ${outfile}`)
      args = transcode(sourcePath, file, profile, outfile)
      break
    case 'thumbnails':
      args = thumbnails(sourcePath, file, profile, outfile)
      break
    case 'firstThumbnail':
      args = firstThumbnail(sourcePath, file, profile, outfile)
      break
    default:
      console.log(`video:transform(${sourcePath}, ${file}, ${JSON.stringify(profile)}) unknown operation ${profile.operation}, skipping`)
      return
  }

  const handler = handleOutfiles(sourcePath, profile, outfile)
  console.log('running ffmpeg transcode: ffmpeg ' + args.join(' '))
  ffmpeg(args, (code) => {
    handler(code).then(() => {
      console.log(`handleOutfiles: finished (${profile.operation}/${profile.name}): ${sourcePath}`)
    })
  })
}

export { transform }
