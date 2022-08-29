const { spawn } = require('node:child_process')

const fs = require('fs')
const path = require('path')
const { glob } = require('glob')
const shellescape = require('shell-escape')
const randomstring = require('randomstring')
const util = require('../util/file')
const redis = require('../util/redis')
const c = require('../../shared')
const m = require('../../shared/media')
const s = require('../../shared/source')
const system = require('../util/config').SYSTEM
const logger = system.logger
const src = require('../source/sourceUtil')
const manifest = require('./manifest')
const q = require('./job')

const MAX_XFORM_ERRORS = 3

const showTransformOutput = () => system.privateConfig.autoscan.showTransformOutput
const cleanupTemporaryAssets = () => system.privateConfig.autoscan.cleanupTemporaryAssets

const XFORM_PROCESS_FUNCTION = (job, done) => {
  ensureSourceDownloaded(job).then((file) => {
    if (file) {
      createArtifacts(job, file).then(() => done())
    }
  })
}

q.initializeQueue(XFORM_PROCESS_FUNCTION)

const MEDIA_COMMANDS = system.privateConfig.media
const ALWAYS_ALLOWED_COMMANDS = ['mediainfo']

function mediainfo (sourcePath, sourceFile, profile, outfile) {
  const args = []
  if (profile.details) {
    args.push('--Details=1')
  } else {
    args.push('--Output=JSON')
    if (profile.full) {
      args.push('--Full')
    }
  }
  args.push(sourceFile)
  return args
}

function profileCommand (profile) {
  return profile.command ? profile.command : MEDIA_COMMANDS[profile.mediaType].allowedCommands[0]
}

function looksLikeShellCommand (command) {
  return command.length <= 5 && command.endsWith('sh')
}

function isCommandAllowed (mediaType, command) {
  const allowedCommands = MEDIA_COMMANDS[mediaType].allowedCommands
  return !looksLikeShellCommand(command) &&
    (ALWAYS_ALLOWED_COMMANDS.includes(command) || (allowedCommands && allowedCommands.includes(command)))
}

function runTransformCommand (job, profile, outfile, args, closeHandler) {
  const mediaType = profile.mediaType
  const command = profileCommand(profile)
  const logPrefix = `runTransformCommand(command=${command}, profile=${profile.name}):`
  const jobPrefix = `${mediaType}_${profile.name}_runTransformCommand`

  // you can't just run any old command here sonny!
  if (!isCommandAllowed(mediaType, command)) {
    throw new TypeError(`${logPrefix}: profile command not allowed: ${command}`)
  }
  const saveStdout = (profile.outfile && profile.outfile === 'stdout')
  const saveStderr = (profile.outfile && profile.outfile === 'stderr')

  const escapedArgs = shellescape(args)
  q.recordJobEvent(job, `${jobPrefix}_spawn`, `${command} ${escapedArgs}`)
  const xform = spawn(command, args)
  const stream = (saveStdout || saveStderr) ? fs.createWriteStream(outfile) : null
  xform.stdout.on('data', (data) => {
    if (saveStdout) {
      stream.write(data, (err) => {
        if (err) {
          logger.debug(`${logPrefix} error writing stdout to ${outfile}: ${err}`)
          throw err
        }
      })
    } else if (showTransformOutput()) {
      logger.debug(`stdout >>>>>> ${data}`)
    }
  })

  xform.stderr.on('data', (data) => {
    if (saveStderr) {
      stream.write(data, (err) => {
        if (err) {
          logger.debug(`${logPrefix} error writing stderr to ${outfile}: ${err}`)
          throw err
        }
      })
    } else if (showTransformOutput()) {
      logger.debug(`stdout >>>>>> ${data}`)
    }
  })

  xform.on('close', (code) => {
    logger.debug(`${logPrefix}  exited with code ${code}`)
    q.recordJobEvent(job, `${jobPrefix}_spawn_END`, `${command}: exit code ${code}`)
    closeHandler(code)
  })
}

function multifilePrefix (outfile) {
  const placeholder = outfile.lastIndexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    const message = `multifilePrefix: expected to find placeholder (${c.MULTIFILE_PLACEHOLDER}) in outfile: ${outfile}`
    logger.error(message)
    throw new TypeError(message)
  }
  return outfile.substring(0, placeholder)
}

function deleteLocalFiles (outfile, profile, job, jobPrefix) {
  if (!cleanupTemporaryAssets()) {
    logger.warn(`deleteLocalFiles: deletion disabled, retaining outfile(s) ${outfile} for profile ${profile.name}`)
    return
  }
  if (profile.multiFile) {
    const outfilePrefix = multifilePrefix(outfile)
    glob(outfilePrefix + '*', (err, files) => {
      if (err) {
        logger.error(`deleteLocalFiles: glob error: ${err}`)
        return
      }
      files.forEach((f) => {
        util.deleteFile(f)
      })
      q.recordJobEvent(job, `${jobPrefix}_deleted_local_files`, files.join('\n'))
    })
  } else {
    util.deleteFile(outfile)
    q.recordJobEvent(job, `${jobPrefix}_deleted_local_file`, outfile)
  }
}

async function clearErrors (job, jobPrefix, sourcePath, profile) {
  q.recordJobEvent(job, `${jobPrefix}_clearing_errors`)
  await system.clearErrors(sourcePath, profile.name)
  q.recordJobEvent(job, `${jobPrefix}_cleared_errors`)
}

const UPLOAD_CONFIRM_DELAY = 3000

async function uploadAsset (sourcePath, outfile, job, jobPrefix) {
  const outfileSize = util.statSize(outfile)
  const destPath = system.assetsDir(sourcePath) + path.basename(outfile)
  const fileUp = fs.createReadStream(outfile)
  logger.debug(`uploadAsset(${destPath}): uploading asset ${outfile} to destPath=${destPath}`)
  q.recordJobEvent(job, `${jobPrefix}_start_uploading_asset`, destPath)

  if (await system.api.write(destPath, fileUp) !== outfileSize) {
    const message = `uploadAsset(${destPath}): error uploading asset (upload failed)`
    logger.error(message)
    q.recordJobEvent(job, `${jobPrefix}_ERROR_uploading_asset`, destPath)
    await system.api.remove(destPath)
    return message
  } else {
    setTimeout(async () => {
      // ensure it was uploaded
      const head = await system.api.safeMetadata(destPath)
      if (head && head.size && head.size === outfileSize) {
        // upload success!
        logger.debug(`uploadAsset(${destPath}): uploaded ${outfile} to destPath=${destPath}`)
        await system.touchLastModified(sourcePath)
        await redis.del(util.redisMetaCacheKey(sourcePath))
        q.recordJobEvent(job, `${jobPrefix}_SUCCESS_uploading_asset`, destPath)
        return null
      } else {
        const message = `uploadAsset(${destPath}): error uploading asset (size mismatch): ${outfile} = ${outfileSize}, head=${JSON.stringify(head)}`
        logger.error(message)
        q.recordJobEvent(job, `${jobPrefix}_ERROR_uploading_asset_size_mismatch`, message)
        await system.api.remove(destPath)
        return message
      }
    }, UPLOAD_CONFIRM_DELAY)
  }
}

async function handleMultiOutputFiles (sourcePath, profile, multifiles, outfile, job, jobPrefix) {
  let errorMessage = null
  const logPrefix = `handleMultiOutputFiles(${profile.name}, ${sourcePath}):`
  if (Array.isArray(multifiles)) {
    const minSize = m.minFileSize(sourcePath, profile.operation)
    multifiles.every((file) => {
      const size = util.statSize(file)
      const sizeOk = size >= minSize
      if (!sizeOk) {
        const message = `${logPrefix} asset file was too small (${size} < ${minSize}): ${file}`
        logger.error(message)
        errorMessage = message
      }
      return sizeOk
    })
  } else {
    const message = `${logPrefix} somehow errorMessage === null but multifiles is not an array: ${JSON.stringify(multifiles)}`
    logger.error(message)
    errorMessage = message
  }
  if (errorMessage === null) {
    // OK, upload all the thumbnails
    for (let i = 0; i < multifiles.length; i++) {
      const f = multifiles[i]
      logger.debug(`${logPrefix} uploading: ${f} ...`)
      const msg = await uploadAsset(sourcePath, f, job, jobPrefix)
      if (msg != null) {
        logger.debug(`${logPrefix} ERROR uploading (${f}) ${msg}`)
        errorMessage = msg
        break
      } else {
        logger.debug(`${logPrefix} upload ${f} SUCCESS`)
      }
    }
  }
  if (errorMessage !== null) {
    logger.error(errorMessage)
    q.recordJobEvent(job, `${jobPrefix}_ERROR_multi_output`, errorMessage)
    await system.recordError(sourcePath, profile.name, errorMessage)
  } else {
    logger.debug(`${logPrefix} clearing errors after successful upload)`)
    await clearErrors(job, jobPrefix, sourcePath, profile)
  }
  logger.debug(`${logPrefix} deleting local outfiles (${errorMessage ? `ERROR: ${errorMessage}` : 'after successful upload'})`)
  deleteLocalFiles(outfile, profile, job, jobPrefix)
}

function handleOutputFiles (job, sourcePath, profile, outfile) {
  const logPrefix = `handleOutputFiles(${profile.name}, ${sourcePath}):`
  const mediaType = profile.mediaType
  const jobPrefix = `${mediaType}_${profile.name}_handleOutputFiles`

  return async (code) => {
    logger.debug(`${logPrefix} starting with outfile ${outfile} and exit code ${code}`)
    if (code !== 0) {
      const message = `${logPrefix} child process exited with code ${code}`
      logger.warn(message)
      q.recordJobEvent(job, `${jobPrefix}_ERROR_exit_code_nonzero`, `${code}`)
      await system.recordError(sourcePath, profile.name, message)
      deleteLocalFiles(outfile, profile, job, jobPrefix)
      return
    }

    if (profile.multiFile) {
      const outfilePrefix = multifilePrefix(outfile)
      logger.debug(`${logPrefix} MULTI-FILE: globbing multifilePrefix=${outfilePrefix}`)
      await glob(outfilePrefix + '*', async (err, files) => {
        logger.debug(`found multifiles in outfilePrefix ${outfilePrefix}: ${JSON.stringify(files)}`)
        if (err) {
          const message = `${logPrefix} GLOB: Error listing multifiles: ${err}`
          logger.error(message)
          q.recordJobEvent(job, `${jobPrefix}_ERROR_listing_files`, `${err}`)
          await system.recordError(sourcePath, profile.name, message)
          deleteLocalFiles(outfile, profile, job, jobPrefix)
        } else if (files && files.length && files.length > 0) {
          logger.debug(`${logPrefix} GLOB: SUCCESS: ${files.length} files matched!`)
          q.recordJobEvent(job, `${jobPrefix}_found_files`, `${files.length} files matched`)
          await handleMultiOutputFiles(sourcePath, profile, files, outfile, job, jobPrefix)
        } else {
          const message = `${logPrefix}  GLOB: No files matched!`
          logger.error(message)
          q.recordJobEvent(job, `${jobPrefix}_ERROR_no_files_matched`)
          await system.recordError(sourcePath, profile.name, message)
          deleteLocalFiles(outfile, profile, job, jobPrefix)
        }
      })
    } else {
      // stat the outfile -- it should be at least a minimum size
      const outfileSize = util.statSize(outfile)
      const minAssetSize = m.minFileSize(sourcePath, profile.operation)
      logger.debug(`${logPrefix} SINGLE-FILE: comparing outfileSize=${outfileSize} < minAssetSize=${minAssetSize}`)
      if (outfileSize < minAssetSize) {
        util.deleteFile(outfile)
        const message = `${logPrefix} profile/operation ${profile.name}/${profile.operation} (min size ${minAssetSize} not met) for outfile ${outfile}`
        logger.warn(message)
        q.recordJobEvent(job, `${jobPrefix}_ERROR_min_size`, message)
        await system.recordError(sourcePath, profile.name, message)
      } else {
        // file is OK, we can upload it to dest
        logger.debug(`${logPrefix} uploading ${outfile} ...`)
        const msg = await uploadAsset(sourcePath, outfile, job, jobPrefix)
        if (msg != null) {
          logger.error(`${logPrefix} ERROR: ${msg}`)
          q.recordJobEvent(job, `${jobPrefix}_ERROR_uploading`, msg)
          await system.recordError(sourcePath, profile.name, msg)
        } else {
          logger.debug(`${logPrefix} upload ${outfile} SUCCESS`)
          q.recordJobEvent(job, `${jobPrefix}_upload_success`)
        }
        logger.debug(`${logPrefix} clearing errors and deleting local files (after successful upload)`)
        await clearErrors(job, jobPrefix, sourcePath, profile)
        deleteLocalFiles(outfile, profile, job, jobPrefix)
      }
    }
  }
}

function mediaTransform (job, file, profile, outfile) {
  const mediaType = profile.mediaType
  const jobPrefix = `mediaTransform_${mediaType}_${profile.name}`

  if (!MEDIA_COMMANDS[mediaType]) {
    throw new TypeError(`invalid media type: ${mediaType}`)
  }
  const driverPath = `./driver/${mediaType}`
  const mediaDriver = require(driverPath)
  q.recordJobEvent(job, `${jobPrefix}_start`)
  const sourcePath = job.data.sourcePath
  const logPrefix = `${mediaType}:transform(${sourcePath}, ${file}, ${profile.name}):`
  logger.debug(`${logPrefix} starting with outfile ${outfile}`)
  if (typeof profile.operation === 'undefined') {
    logger.debug(`${logPrefix} no operation defined on profile, skipping: profile=${JSON.stringify(profile)}`)
    q.recordJobEvent(job, `${jobPrefix}_ERROR_invalid_operation`)
    return
  }
  if (!profile.enabled) {
    logger.debug(`${logPrefix} profile not enabled, skipping`)
    q.recordJobEvent(job, `${jobPrefix}_ERROR_not_enabled`)
    return
  }

  let xform
  if (profile.operation === m.OP_MEDIAINFO) {
    xform = mediainfo
  } else {
    xform = mediaDriver[profile.operation]
    if (!xform) {
      throw new TypeError(`${logPrefix}: operation '${profile.operation}' not supported: No function named ${profile.operation} exported from ${driverPath}`)
    }
  }
  const args = xform(sourcePath, file, profile, outfile)
  const outputHandler = handleOutputFiles(job, sourcePath, profile, outfile)
  logger.debug(`transform: running xform command: ${profileCommand(profile)} ${args.join(' ')}`)
  q.recordJobEvent(job, `${jobPrefix}_xform_${xform.name}`, `${profileCommand(profile)}`)
  runTransformCommand(job, profile, outfile, args, (code) => {
    q.recordJobEvent(job, `${jobPrefix}_outputHandler_start`, `${profileCommand(profile)} exit code: ${code}`)
    outputHandler(code).then(() => {
      q.recordJobEvent(job, `${jobPrefix}_outputHandler_COMPLETE`)
      logger.debug(`handleOutputFiles: finished (${profile.operation}/${profile.name}): ${sourcePath}`)
    })
  })
  q.recordJobEvent(job, `${jobPrefix}_DONE`)
}

async function createArtifacts (job, localSourceFile) {
  const sourcePath = job.data.sourcePath

  logger.debug('createArtifacts: starting with file: ' + localSourceFile)
  q.recordJobEvent(job, 'artifacts_start')

  const mediaType = m.mediaType(sourcePath)
  const profiles = m.mediaProfilesForSource(sourcePath)
  if (profiles === null) {
    logger.debug(`createArtifacts: no media profiles exist for path: ${sourcePath} (returning basic meta)`)
    q.recordJobEvent(job, 'artifacts_ERROR_no_profiles')
    return
  }

  for (const name in profiles) {
    const artifactPrefix = `artifact_${name}`
    const profile = profiles[name]
    if (!profile.enabled) {
      logger.debug(`createArtifacts: profile disabled, skipping: ${name}`)
      continue
    }

    let completedAssetKey
    let outfile

    // determine which destPath we will check to determine if the transform has completed
    if (profile.multiFile) {
      const outfilePrefix = path.dirname(localSourceFile) + '/' + m.ASSET_PREFIX + name
      outfile = outfilePrefix + m.assetSuffix(mediaType) + c.MULTIFILE_PLACEHOLDER + '.' + profile.ext
      completedAssetKey = system.assetsDir(sourcePath) + m.ASSET_PREFIX + name + m.assetSuffix(mediaType) + c.MULTIFILE_FIRST + '.' + profile.ext
    } else {
      outfile = path.dirname(localSourceFile) + '/' + m.ASSET_PREFIX + name + m.assetSuffix(mediaType) + '.' + profile.ext
      completedAssetKey = system.assetsDir(sourcePath) + path.basename(outfile)
    }

    q.recordJobEvent(job, `${artifactPrefix}_HEAD_dest`)
    const destHead = await system.api.safeMetadata(completedAssetKey)
    if (destHead && destHead.size && destHead.size > 0) {
      logger.debug(`createArtifacts: artifact ${path.basename(completedAssetKey)} exists for profile ${name} (skipping) for source ${sourcePath}`)
      q.recordJobEvent(job, `${artifactPrefix}_SUCCESS_HEAD_dest`, 'all dest files exist, already processed')
      continue
    }
    const errCount = await system.countErrors(sourcePath, name)
    if (errCount >= MAX_XFORM_ERRORS) {
      logger.warn(`createArtifacts: transcoding artifact for profile ${name} has failed too many times (${errCount} >= ${MAX_XFORM_ERRORS}) for ${sourcePath}, giving up`)
      q.recordJobEvent(job, `${artifactPrefix}_ERROR_err_count_exceeded`, `more than ${MAX_XFORM_ERRORS} errors, not retrying`)
      continue
    }

    q.recordJobEvent(job, `${artifactPrefix}_starting_xform_${mediaType}`)
    mediaTransform(job, localSourceFile, profile, outfile)
    q.recordJobEvent(job, `${artifactPrefix}_completed_xform_${mediaType}`)
  }
}

async function ensureSourceDownloaded (job) {
  const sourcePath = job.data.sourcePath
  const { source, pth } = await src.extractSourceAndPathAndConnect(sourcePath)
  const mediaType = m.mediaType(pth)
  const jobPrefix = `ensureSourceDownload_${mediaType}_${path.basename(pth)}`
  q.recordJobEvent(job, `${jobPrefix}_download_start`)

  // Does the local copy of the source exist already?
  const file = system.workingDir(sourcePath) + system.canonicalSourceFile(sourcePath)
  const size = util.statSize(file)

  if (size !== -1) {
    // we have a file with some size. do a HEAD request for the source
    // we might already have the whole file
    const head = await source.safeMetadata(pth)
    if (head && head.size && head.size === size) {
      q.recordJobEvent(job, `${jobPrefix}_download_using_cached_source`)
      return file
    }
  }

  logger.debug(`ensureSourceDownload: downloading source to file: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const MAX_TRIES = 10
  let head = null
  for (let i = 1; i <= MAX_TRIES; i++) {
    const attemptPrefix = `${jobPrefix}_download_attempt_${i}`
    try {
      if (head !== null) {
        // check temp file again, it may already exist
        const size = util.statSize(file)
        if (size !== -1 && head.size && head.size === size) {
          logger.debug(`ensureSourceDownload: before downloaded source file, it already correctly exists, using it: ${file}`)
          q.recordJobEvent(job, `${jobPrefix}_download_using_cached_source_attempt_${i}`)
          return file
        }
      }
      const tempFile = `${file}.ensureSourceDownload_${Date.now()}_${randomstring.generate(4)}`
      const f = fs.createWriteStream(tempFile)
      const counter = { count: 0 }
      const bytesRead = await source.read(pth, (chunk) => {
        counter.count += chunk ? chunk.length : 0
        f.write(chunk)
      }, () => {
        f.close(async (err) => {
          if (err) {
            logger.error(`ensureSourceDownload: error closing file: ${tempFile}: ${err}`)
          }
          const downloadSize = util.statSize(tempFile)
          if (head == null) {
            q.recordJobEvent(job, `${attemptPrefix}_HEAD_source`)
            head = await source.safeMetadata(pth)
          }
          if (head && head.size && head.size === downloadSize) {
            const existingSize = util.statSize(file)
            if (existingSize === head.size) {
              logger.debug(`ensureSourceDownload: successfully downloaded source file, but someone else beat us to it (using their file): ${file}`)
              fs.rmSync(tempFile)
            } else {
              logger.debug(`ensureSourceDownload: renaming temp download ${tempFile} -> ${file}`)
              fs.renameSync(tempFile, file)
              logger.debug(`ensureSourceDownload: successfully downloaded complete source file: ${file}`)
              q.recordJobEvent(job, `${attemptPrefix}_download_SUCCESS`)
            }
            return file
          }
          let message
          if (head && head.size) {
            message = `ensureSourceDownload: downloaded file ${file} (size=${downloadSize}) which does not match source size: ${head.ContentLength}`
          } else {
            message = `ensureSourceDownload: downloaded file ${file} (size=${downloadSize}) but could never read ContentLength from HEAD: ${JSON.stringify(head)}`
          }
          logger.error(message)
          q.recordJobEvent(job, `${attemptPrefix}_download_ERROR_size_mismatch`, message)
        })
      })
      logger.debug(`ensureSourceDownload: downloaded ${bytesRead} bytes on attempt ${attemptPrefix}`)
    } catch (err) {
      logger.debug(`ensureSourceDownload: ERROR downloading source file: ${file}: ${err}`)
      q.recordJobEvent(job, `${attemptPrefix}_download_ERROR`, `${err}`)
    }
  }
  const fileSize = util.statSize(file)
  if (head && head.size && head.size === fileSize) {
    logger.debug(`ensureSourceDownload: despite max tries exceeded (${MAX_TRIES}), file exists and is OK, continuing...`)
    q.recordJobEvent(job, `${jobPrefix}_attemptsExceeded_download_SUCCESS`)
    return file
  } else {
    // max tries exceeded
    logger.debug(`ensureSourceDownload: downloaded file ${file} failed, max tries exceeded (${MAX_TRIES})`)
    q.recordJobEvent(job, `${jobPrefix}_download_FAIL`, `max tries exceeded (${MAX_TRIES})`)
    return null
  }
}

async function transform (sourcePath) {
  const logPrefix = `transform(${sourcePath}):`
  if (!m.hasProfiles(sourcePath)) {
    logger.warn(`${logPrefix} no profiles exist, not transforming`)
    return null
  }

  const { sourceName, pth } = s.extractSourceAndPath(sourcePath)
  const source = await src.connect(sourceName)

  logger.debug(`${logPrefix}) fetching metadata`)
  const derivedMeta = await manifest.deriveMetadata(source, pth)
  if (derivedMeta && derivedMeta.status && derivedMeta.status.complete) {
    return derivedMeta
  }
  if (q.isQueued(sourcePath)) {
    if (q.isStaleJob(sourcePath)) {
      logger.warn(`${logPrefix} already queued (at ${q.cdate(sourcePath)}), but that was too long ago (> ${q.MAX_JOB_TIME}), re-submitting job...`)
    } else {
      logger.warn(`${logPrefix} already queued (at ${q.cdate(sourcePath)}), not re-queueing`)
      return derivedMeta
    }
  }

  logger.debug(`${logPrefix} adding to jobQueue: ${sourcePath}`)
  q.enqueue(sourcePath)
  return derivedMeta
}

export { transform }
