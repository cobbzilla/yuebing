import { spawn } from 'node:child_process'
import fs from 'fs'
import path from 'path'
import glob from 'glob'
const s3util = require('../s3/s3util')
const redis = require('../util/redis')
const util = require('../util/file')
const m = require('../../shared/media')

const DEFAULT_FIRST_THUMBNAIL_OFFSET = '5.0'

const VIDEO_ASSET_SUFFIX = m.assetSuffix(m.VIDEO_MEDIA_TYPE)

const VALID_XFORM_COMMANDS = ['ffmpeg', 'mediainfo']
const DEFAULT_XFORM_COMMAND = 'ffmpeg'

function runTransformCommand (profile, outfile, args, closeHandler) {
  // you can't just run any old command here sonny!
  const command = profile.command ? profile.command : DEFAULT_XFORM_COMMAND
  if (!VALID_XFORM_COMMANDS.includes(command)) {
    throw new TypeError(`run_xform_command: illegal profile command: ${command}`)
  }
  const logPrefix = `runTransformCommand(command=${command}, profile=${profile.name}):`
  const saveStdout = (profile.outfile && profile.outfile === 'stdout')
  const saveStderr = (profile.outfile && profile.outfile === 'stderr')

  const xform = spawn(command, args)
  const stream = (saveStdout || saveStderr) ? fs.createWriteStream(outfile) : null
  xform.stdout.on('data', (data) => {
    if (saveStdout) {
      stream.write(data, (err) => {
        if (err) {
          console.log(`${logPrefix} error writing stdout to ${outfile}: ${err}`)
          throw err
        }
      })
    } else {
      console.log(`stdout >>>>>> ${data}`)
    }
  })

  xform.stderr.on('data', (data) => {
    if (saveStderr) {
      stream.write(data, (err) => {
        if (err) {
          console.log(`${logPrefix} error writing stderr to ${outfile}: ${err}`)
          throw err
        }
      })
    } else {
      console.log(`stdout >>>>>> ${data}`)
    }
  })

  xform.on('close', (code) => {
    console.log(`${logPrefix}  exited with code ${code}`)
    closeHandler(code)
  })
}

function multifilePrefix (outfile) {
  const placeholder = outfile.lastIndexOf(util.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    const message = `multifilePrefix: expected to find placeholder (${util.MULTIFILE_PLACEHOLDER}) in outfile: ${outfile}`
    console.error(message)
    throw new TypeError(message)
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
  if (await s3util.uploadObject({ Key: destKey, Body: fileUp }) == null) {
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
      await redis.del(util.redisMetaCacheKey(sourcePath))
      return null
    } else {
      const message = `uploadAsset(${destKey}): error uploading asset (size mismatch): ${outfile} = ${outfileSize}, head=${JSON.stringify(head)}`
      console.error(message)
      await s3util.deleteDestObject(destKey)
      return message
    }
  }
}

async function handleMultiOutputFiles (sourcePath, profile, multifiles, outfile) {
  let errorMessage = null
  const logPrefix = `handleMultiOutputFiles(${profile.name}, ${sourcePath}):`
  if (Array.isArray(multifiles)) {
    const minSize = m.minFileSize(sourcePath, profile.operation)
    multifiles.every((file) => {
      const size = util.statSize(file)
      const sizeOk = size >= minSize
      if (!sizeOk) {
        const message = `${logPrefix} asset file was too small (${size} < ${minSize}): ${file}`
        console.error(message)
        errorMessage = message
      }
      return sizeOk
    })
  } else {
    const message = `${logPrefix} somehow errorMessage === null but multifiles is not an array: ${JSON.stringify(multifiles)}`
    console.error(message)
    errorMessage = message
  }
  if (errorMessage === null) {
    // OK, upload all the thumbnails
    for (let i = 0; i < multifiles.length; i++) {
      const f = multifiles[i]
      console.log(`${logPrefix} uploading: ${f} ...`)
      const msg = await uploadAsset(sourcePath, f)
      if (msg != null) {
        console.log(`${logPrefix} ERROR uploading (${f}) ${msg}`)
        errorMessage = msg
        break
      } else {
        console.log(`${logPrefix} upload ${f} SUCCESS`)
      }
    }
  }
  if (errorMessage !== null) {
    console.error(errorMessage)
    s3util.recordError(sourcePath, profile.name, errorMessage)
  } else {
    console.log(`${logPrefix} clearing errors after successful upload)`)
    await s3util.clearErrors(sourcePath, profile.name)
  }
  console.log(`${logPrefix} deleting local outfiles (${errorMessage ? `ERROR: ${errorMessage}` : 'after successful upload'})`)
  deleteLocalOutfiles(outfile, profile)
}

function handleOutputFiles (sourcePath, profile, outfile) {
  const logPrefix = `handleOutputFiles(${profile.name}, ${sourcePath}):`
  return async (code) => {
    console.log(`${logPrefix} starting with outfile ${outfile} and ffmpeg exit code ${code}`)
    if (code !== 0) {
      const message = `${logPrefix} child process exited with code ${code}`
      console.warn(message)
      s3util.recordError(sourcePath, profile.name, message)

      console.log(`${logPrefix} deleting local outfiles (ffmpeg error)`)
      deleteLocalOutfiles(outfile, profile)
      return
    }

    if (profile.multiFile) {
      const outfilePrefix = multifilePrefix(outfile)
      await glob(outfilePrefix + '*', async (err, files) => {
        console.log(`found multifiles in outfilePrefix ${outfilePrefix}: ${JSON.stringify(files)}`)
        if (err) {
          const message = `${logPrefix} GLOB: Error listing multifiles: ${err}`
          console.error(message)
        } else if (files && files.length && files.length > 0) {
          console.log(`${logPrefix} GLOB: SUCCESS: ${files.length} files matched!`)
          await handleMultiOutputFiles(sourcePath, profile, files, outfile)
        } else {
          const message = `${logPrefix}  GLOB: No files matched!`
          console.error(message)
        }
      })
    } else {
      // stat the outfile -- it should be at least a minimum size
      const outfileSize = util.statSize(outfile)
      const minAssetSize = m.minFileSize(sourcePath, profile.operation)
      if (outfileSize < minAssetSize) {
        util.deleteFile(outfile)
        const message = `${logPrefix} profile/operation ${profile.name}/${profile.operation} (min size ${minAssetSize} not met) for outfile ${outfile}`
        console.warn(message)
        s3util.recordError(sourcePath, profile.name, message)
      } else {
        // file is OK, we can upload it to dest
        console.log(`${logPrefix} uploading ${outfile} ...`)
        const msg = await uploadAsset(sourcePath, outfile)
        if (msg != null) {
          console.error(`${logPrefix} ERROR: ${msg}`)
          s3util.recordError(sourcePath, profile.name, msg)
        } else {
          console.log(`${logPrefix} upload ${outfile} SUCCESS`)
        }
        console.log(`${logPrefix} clearing errors and deleting local outfiles (after successful upload)`)
        await s3util.clearErrors(sourcePath, profile.name)
        deleteLocalOutfiles(outfile, profile)
      }
    }
  }
}

function mediainfo (sourcePath, sourceFile, profile, outfile) {
  const args = []
  if (profile.details) {
    args.push(['--Details=1'])
  } else {
    args.push(['--Output=JSON'])
    if (profile.full) {
      args.push(['--Full'])
    }
  }
  args.push(sourceFile)
  return args
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

function dash (sourcePath, sourceFile, profile, outfile) {
  // adjust output file to match what xform.js checks for, for multiFile profiles
  const placeholder = outfile.indexOf(util.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`dash: expected outfile to contain multifile placeholder (${util.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }
  const dashOutfile = outfile.substring(0, placeholder) +
    util.MULTIFILE_FIRST +
    outfile.substring(placeholder + util.MULTIFILE_PLACEHOLDER.length)
  console.log(`dash: calculated dashOutfile = ${dashOutfile}`)

  const args = []
  args.push('-i')
  args.push(sourceFile)
  for (let i = 0; i < profile.subProfiles.length; i++) {
    args.push('-map')
    args.push('0')
  }
  for (let i = 0; i < profile.subProfiles.length; i++) {
    args.push(`-c:a:${i}`)
    args.push(profile.subProfiles[i].audioCodec)
    args.push(`-b:a:${i}`)
    args.push(profile.subProfiles[i].audioBitrate)
    args.push(`-ar:${i}`)
    args.push(profile.subProfiles[i].audioRate)
    args.push(`-ac:${i}`)
    args.push(profile.subProfiles[i].audioChannels)
    args.push(`-c:v:${i}`)
    args.push(profile.subProfiles[i].videoCodec)
    args.push(`-b:v:${i}`)
    args.push(profile.subProfiles[i].videoBitrate)
    args.push(`-s:v:${i}`)
    args.push(profile.subProfiles[i].videoSize)
    args.push(`-profile:v:${i}`)
    args.push('main')
  }

  // we enable the template below, so I'm not sure if window_size is relevant
  // but given that the playlist will be statically hosted and never dynamically
  // generated we set this to a very large value, such that the playlist should
  // always contain all segments
  args.push('-window_size')
  args.push('1000000')

  // are these needed? they are the defaults
  args.push('-use_timeline')
  args.push('1')
  args.push('-use_template')
  args.push('1')

  // todo: see what these do: b-frames, minimum keyframe interval and GOP (group of picture) size
  // args.push('-bf')
  // args.push('1')
  // args.push('-keyint_min')
  // args.push('120')
  // args.push('-g')
  // args.push('120')
  // args.push('-sc_threshold')
  // args.push('0') // default is already zero?
  // args.push('-b_strategy')
  // args.push('0') // default is already zero?

  // todo: add a subtitles set if we detect that the media has subtitles
  args.push('-adaptation_sets')
  args.push('id=0,streams=v id=1,streams=a')

  // ensure output assets are named appropriately so that handleOutputFiles picks them up
  args.push('-init_seg_name')
  args.push(`${m.ASSET_PREFIX}${profile.name}${VIDEO_ASSET_SUFFIX}init-stream$RepresentationID$.$ext$`)
  args.push('-media_seg_name')
  args.push(`${m.ASSET_PREFIX}${profile.name}${VIDEO_ASSET_SUFFIX}chunk-stream$RepresentationID$-$Number%05d$.$ext$`)

  args.push('-f')
  args.push('dash')
  args.push('-y')
  args.push(dashOutfile)
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

const XFORM_FUNCS = {}
XFORM_FUNCS[m.OP_TRANSCODE] = transcode
XFORM_FUNCS[m.OP_DASH] = dash
XFORM_FUNCS[m.OP_MEDIAINFO] = mediainfo
XFORM_FUNCS[m.OP_THUMBNAILS] = thumbnails
XFORM_FUNCS[m.OP_FIRST_THUMBNAIL] = firstThumbnail

function transform (sourcePath, file, profile, outfile) {
  const logPrefix = `video:transform(${sourcePath}, ${file}, ${profile.name}):`
  console.log(`${logPrefix} starting with outfile ${outfile}`)
  if (typeof profile.operation === 'undefined') {
    console.log(`${logPrefix} no operation defined on profile, skipping: profile=${JSON.stringify(profile)}`)
    return
  }
  if (!profile.enabled) {
    console.log(`${logPrefix} profile not enabled, skipping`)
    return
  }

  const xform = XFORM_FUNCS[profile.operation]
  const args = xform(sourcePath, file, profile, outfile)
  const outputHandler = handleOutputFiles(sourcePath, profile, outfile)
  console.log(`transform: running xform command: ${profile.command} ${args.join(' ')}`)
  runTransformCommand(profile, outfile, args, (code) => {
    outputHandler(code).then(() => {
      console.log(`handleOutputFiles: finished (${profile.operation}/${profile.name}): ${sourcePath}`)
    })
  })
}

export { transform }
