const { spawn } = require('node:child_process')

const fs = require('fs')
const { dirname, basename, join } = require('path')
const { glob } = require('glob')
const shellescape = require('shell-escape')
const randomstring = require('randomstring')
const c = require('../../shared')
const m = require('../../shared/media')
const { extractVolumeAndPath } = require('../../shared/model/volume')
const util = require('../util/file')
const system = require('../util/config').SYSTEM
const logger = system.logger
const src = require('../volume/volumeUtil')
const manifest = require('./manifest')
const q = require('./job')
const { pathRegistrationAge } = require('../user/tagUtil')
const { multifilePrefix, deleteLocalFiles } = require('./cleanup')
const { queueUploadAsset } = require('./upload')
const { loadMediaDriver } = require('./driver')

const MAX_XFORM_ERRORS = 3

const showTransformOutput = () => system.privateConfig.autoscan.showTransformOutput

const MIN_REG_AGE = 1000 * 60 * 60 * 24 // max successful 1 transcode per day

const DONE_JOBS = {}

const XFORM_PROCESS_FUNCTION = async (job) => {
  const logPrefix = `__xform(${job.data.sourcePath})`
  if (DONE_JOBS[job.id]) {
    logger.warn(`${logPrefix} job ID ${job.id} has already been resolved`)
    return null
  }
  try {
    const regAge = await pathRegistrationAge(job.data.sourcePath)
    if (regAge && regAge < MIN_REG_AGE) {
      if (job.data.opts && job.data.opts.reprocess && job.data.opts.reprocess.length > 0) {
        logger.warn(`${logPrefix} path was recently registered (age=${regAge}), but reprocess=${JSON.stringify(job.data.opts.reprocess)}, proceeding`)
      } else {
        logger.warn(`${logPrefix} path was recently registered (age=${regAge}), NOT PROCESSING`)
        return null
      }
    }
    if (job.data.opts && job.data.opts.olderThan) {
      const olderThan = job.data.opts.olderThan
      const lastModified = await system.lastModified(job.data.sourcePath)
      if (lastModified && lastModified < olderThan) {
        logger.warn(`${logPrefix} olderThan (${new Date(olderThan)}) < lastModified $(${new Date(lastModified)}), proceeding`)
      } else {
        logger.warn(`${logPrefix} olderThan (${new Date(olderThan)}) >= lastModified $(${new Date(lastModified)}), NOT PROCESSING`)
        return null
      }
    }

    logger.silly(`${logPrefix} STARTING`)
    const file = await ensureSourceDownloaded(job)
    logger.silly(`${logPrefix} ensureSourceDownloaded returned: ${file}`)
    if (file) {
      logger.silly(`${logPrefix} createArtifacts STARTING`)
      try {
        await createArtifacts(job, file)
      } catch (e) {
        logger.error(`${logPrefix} create artifacts failed with error: ${e}`)
        throw e
      }
    } else {
      const message = `${logPrefix} ensureSourceDownloaded did not return a file`
      logger.error(message)
      throw new TypeError(message)
    }
  } finally {
    DONE_JOBS[job.id] = true
  }
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
  return profile.command ? profile.command : profile.func ? `function:${profile.func}` : MEDIA_COMMANDS[profile.mediaType].allowedCommands[0]
}

function looksLikeShellCommand (command) {
  return basename(command).length <= 5 && command.endsWith('sh')
}

function isCommandAllowed (mediaType, command) {
  const allowedCommands = MEDIA_COMMANDS[mediaType].allowedCommands

  return !looksLikeShellCommand(command) &&
    (ALWAYS_ALLOWED_COMMANDS.includes(command) || (allowedCommands && allowedCommands.includes(command)))
}

async function runTransformCommand (job, mediaDriver, profile, outfile, args, closeHandler) {
  const mediaType = profile.mediaType
  const command = profile.func ? `function: ${profile.func}` : profileCommand(profile)
  const jobPrefix = profile.func
    ? `${mediaType}_${profile.name}_runTransformFunction`
    : `${mediaType}_${profile.name}_runTransformCommand`

  const logPrefix = `runTransformCommand(command=${command}, profile=${profile.name}):`

  const completionHandler = (resolve, reject, args) => async (code) => {
    try {
      if (code !== 0) {
        logger.error(`${logPrefix} spawned command exited with code ${code}. command was: ${command} ${args}`)
        reject(code)
      } else {
        logger.debug(`${logPrefix} spawned command exited OK (code ${code}). command was: ${command} ${args}`)
        q.recordJobEvent(job, `${jobPrefix}_spawn_END`, `${command}: exit code ${code}`)
        try {
          await closeHandler(code)
          resolve(code)
        } catch (closeErr) {
          logger.error(`${logPrefix} error in closeHandler: ${closeErr}`)
          q.recordJobEvent(job, `${jobPrefix}_ERROR_closeHandler`, `${command}: closeHandler error ${closeErr}`)
          reject(closeErr)
        }
      }
    } catch (e) {
      reject(e)
    }
  }
  if (profile.func) {
    const driverFunc = mediaDriver[profile.func]
    if (!driverFunc) {
      throw new TypeError(`${logPrefix} profile function not found: ${profile.func}`)
    }
    return new Promise(async (resolve, reject) => {
      q.recordJobEvent(job, `${jobPrefix}_spawn`, `${profile.func} ${JSON.stringify(args)}`)
      try {
        const code = await driverFunc(args)
        await completionHandler(resolve, reject, args)(code)
      } catch (e) {
        await completionHandler(resolve, reject, args)(e)
      }
    })
  } else {
    // you can't just run any old command here sonny!
    if (!isCommandAllowed(mediaType, command)) {
      throw new TypeError(`${logPrefix} profile command not allowed: ${command}`)
    }
    const saveStdout = (profile.outfile && profile.outfile === 'stdout')
    const saveStderr = (profile.outfile && profile.outfile === 'stderr')

    const escapedArgs = shellescape(args)
    q.recordJobEvent(job, `${jobPrefix}_spawn`, `${command} ${escapedArgs}`)
    const xform = spawn(command, args)
    const stream = (saveStdout || saveStderr) ? fs.createWriteStream(outfile) : null
    return new Promise((resolve, reject) => {
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
          logger.debug(`stderr >>>>>> ${data}`)
        }
      })

      xform.on('close', completionHandler(resolve, reject, escapedArgs))
    })
  }
}

async function clearErrors (job, jobPrefix, sourcePath, profile) {
  q.recordJobEvent(job, `${jobPrefix}_clearing_errors`)
  await system.clearErrors(sourcePath, profile.name)
  q.recordJobEvent(job, `${jobPrefix}_cleared_errors`)
}

async function uploadAsset (sourcePath, profile, outfile, job, jobPrefix) {
  queueUploadAsset(sourcePath, profile, outfile, job, jobPrefix)
  return null
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
    // OK, upload all the files
    for (let i = 0; i < multifiles.length; i++) {
      const f = multifiles[i]
      logger.debug(`${logPrefix} uploading: ${f} ...`)
      const msg = await uploadAsset(sourcePath, profile, f, job, jobPrefix)
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

    const filesToUpload = []
    if (profile.multiFile) {
      const outfilePrefix = multifilePrefix(profile, outfile)
      const outfileSuffix = typeof profile.ext === 'string' ? '.'+profile.ext : ''
      logger.debug(`${logPrefix} MULTI-FILE: globbing multifilePrefix=${outfilePrefix}`)
      await new Promise(async (resolve, reject) => {
        await glob(outfilePrefix + '*' + outfileSuffix, async (err, files) => {
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
            filesToUpload.push(...files)
            await handleMultiOutputFiles(sourcePath, profile, files, outfile, job, jobPrefix)
          } else {
            const message = `${logPrefix}  GLOB: No files matched!`
            logger.error(message)
            q.recordJobEvent(job, `${jobPrefix}_ERROR_no_files_matched`)
            await system.recordError(sourcePath, profile.name, message)
            deleteLocalFiles(outfile, profile, job, jobPrefix)
          }
          if (profile.additionalAssets && Array.isArray(profile.additionalAssets)) {
            const assetsDir = dirname(outfile)
            const files = fs.readdirSync(assetsDir)
            for (const regex of profile.additionalAssets) {
              if (!(regex instanceof RegExp)) {
                const message = `${logPrefix} regex in profile.additionalAssets is not a RegExp: ${regex}`
                logger.error(message)
                return reject(message)
              }
              try {
                const matches = files
                  .filter(f => !filesToUpload.includes(f))
                  .filter(f => regex.test(f))
                logger.info(`${logPrefix} found ${matches.length} additionalAssets for regex ${regex}`)
                for (const match of matches) {
                  await uploadAsset(sourcePath, profile, join(assetsDir, match), job, jobPrefix)
                }
              } catch (e) {
                const message = `${logPrefix} error matching/uploading additionalAssets: ${e}`
                logger.error(message)
                return reject(message)
              }
            }
          }
          resolve()
        })
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
        const msg = await uploadAsset(sourcePath, profile, outfile, job, jobPrefix)
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
      }
    }
  }
}

async function mediaTransform (job, file, profile, outfile) {
  const mediaType = profile.mediaType
  const jobPrefix = `mediaTransform_${mediaType}_${profile.name}`

  if (!MEDIA_COMMANDS[mediaType]) {
    throw new TypeError(`invalid media type: ${mediaType}`)
  }
  const mediaDriver = loadMediaDriver(mediaType)
  if (!mediaDriver) {
    throw new TypeError(`loadMediaDriver: no media driver for type: ${mediaType}`)
  }
  q.recordJobEvent(job, `${jobPrefix}_start`)
  const sourcePath = job.data.sourcePath
  const logPrefix = `${jobPrefix} transform(${sourcePath}):`
  logger.debug(`${logPrefix} starting with outfile ${outfile}`)
  if (typeof profile.operation === 'undefined') {
    logger.debug(`${logPrefix} no operation defined on profile, skipping: profile=${JSON.stringify(profile)}`)
    q.recordJobEvent(job, `${logPrefix}_ERROR_invalid_operation`)
    return
  }
  if (!profile.enabled) {
    logger.debug(`${logPrefix} profile not enabled, skipping`)
    q.recordJobEvent(job, `${logPrefix}_ERROR_not_enabled`)
    return
  }

  let xform
  if (profile.operation === m.OP_MEDIAINFO) {
    xform = mediainfo
  } else {
    xform = mediaDriver[profile.operation]
    if (!xform) {
      throw new TypeError(`${logPrefix} operation '${profile.operation}' not supported: No function named ${profile.operation} exported from ${driverPath}`)
    }
  }
  const outputHandler = handleOutputFiles(job, sourcePath, profile, outfile)
  const closeHandler = async (code) => {
      q.recordJobEvent(job, `${logPrefix}_outputHandler_start`, `${profileCommand(profile)} exit code: ${code}`)
      await outputHandler(code)
      q.recordJobEvent(job, `${logPrefix}_outputHandler_COMPLETE`)
      logger.debug(`handleOutputFiles: finished (${profile.operation}/${profile.name}): ${sourcePath}`)
  }
  q.recordJobEvent(job, `${logPrefix}_xform_${xform.name}`, `${profileCommand(profile)}`)
  const args = await xform(sourcePath, file, profile, outfile)
  if (args === null) {
    q.recordJobEvent(job, `${logPrefix}_xform_${xform.name}_SKIPPED_NO_ARGS`, `${profileCommand(profile)}`)
  } else {
    await runTransformCommand(job, mediaDriver, profile, outfile, args, closeHandler)
  }
  q.recordJobEvent(job, `${logPrefix}_DONE`)
}

function alreadyProcessed(profile, mediaType, existingAssets) {
  if (existingAssets == null || existingAssets.length === 0) return false

  if (profile.manifestAssets) {
    for (const manifest of profile.manifestAssets) {
      if (!existingAssets.some(a => basename(a.name) === manifest)) {
        return false
      }
    }

  } else if (profile.multiFile) {
    const outfilePrefix = m.ASSET_PREFIX + profile.name
    if (!existingAssets.some(a => basename(a.name).startsWith(outfilePrefix))) {
      return false
    }

  } else {
    const outfile = m.ASSET_PREFIX + profile.name + m.assetSuffix(mediaType) + '.' + profile.ext
    if (!existingAssets.some(a => basename(a.name) === outfile)) {
      return false
    }
  }
  return true
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

  q.recordJobEvent(job, `createArtifacts_LIST_EXISTING_ASSETS`)
  const existingAssets = await system.storage.safeList(system.assetsDir(sourcePath))

  for (const name in profiles) {
    const artifactPrefix = `artifact_${name}`
    const profile = profiles[name]
    if (!profile.enabled) {
      logger.debug(`createArtifacts: profile disabled, skipping: ${name}`)
      q.recordJobEvent(job, `${artifactPrefix}_DISABLED_DONE`)
      continue
    }
    if (profile.noop) {
      logger.debug(`createArtifacts: profile is a noop, skipping: ${name}`)
      q.recordJobEvent(job, `${artifactPrefix}_NOOP_DONE`)
      continue
    }

    const reprocessProfiles = job.data.opts.reprocess && job.data.opts.reprocess.length > 0 ? job.data.opts.reprocess : null
    if (reprocessProfiles) {
      if (reprocessProfiles.includes(name) || reprocessProfiles.find(p => p.profile === name)) {
        q.recordJobEvent(job, `${artifactPrefix}_HEAD_dest_SKIPPED_FOR_REPROCESSING`)
      } else {
        q.recordJobEvent(job, `${artifactPrefix}_REPROCESSING_NOT_THIS_PROFILE`)
        continue
      }
    } else if (alreadyProcessed(profile, mediaType, existingAssets)) {
      logger.debug(`createArtifacts: artifact(s) found for profile ${name} (skipping) for source ${sourcePath}`)
      q.recordJobEvent(job, `${artifactPrefix}_SUCCESS_HEAD_dest`, 'dest file(s) found, already processed')
      continue
    }
    const errCount = await system.countErrors(sourcePath, name)
    if (errCount >= MAX_XFORM_ERRORS) {
      if (job.data.opts.ignoreErrors) {
        logger.warn(`createArtifacts: transcoding artifact for profile ${name} has many times (${errCount} >= ${MAX_XFORM_ERRORS}) for ${sourcePath}, but force === true, so we are trying again`)
        q.recordJobEvent(job, `${artifactPrefix}_INFO_err_count_exceeded_trying_anyway`, `${errCount} >= ${MAX_XFORM_ERRORS} errors, not retrying`)
      } else {
        logger.warn(`createArtifacts: transcoding artifact for profile ${name} has failed too many times (${errCount} >= ${MAX_XFORM_ERRORS}) for ${sourcePath}, giving up`)
        q.recordJobEvent(job, `${artifactPrefix}_ERROR_err_count_exceeded`, `${errCount} >= ${MAX_XFORM_ERRORS} errors, not retrying`)
        continue
      }
    }

    let outfile
    if (profile.multiFile) {
      const outfilePrefix = dirname(localSourceFile) + '/' + m.ASSET_PREFIX + name
      outfile = outfilePrefix + m.assetSuffix(mediaType) + c.MULTIFILE_PLACEHOLDER + '.' + profile.ext
    } else {
      outfile = dirname(localSourceFile) + '/' + m.ASSET_PREFIX + name + m.assetSuffix(mediaType) + '.' + profile.ext
    }

    q.recordJobEvent(job, `${artifactPrefix}_starting_xform_${mediaType}`)
    await mediaTransform(job, localSourceFile, profile, outfile)
    q.recordJobEvent(job, `${artifactPrefix}_completed_xform_${mediaType}`)
  }
}

async function ensureSourceDownloaded (job) {
  const sourcePath = job.data.sourcePath
  const { volume, pth } = await src.extractVolumeAndPathAndConnect(sourcePath)
  const source = volume
  const mediaType = m.mediaType(pth)
  const jobPrefix = `ensureSourceDownload_${mediaType}_${basename(pth)}`
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
  fs.mkdirSync(dirname(file), { recursive: true })
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
            logger.error(`ensureSourceDownload: error closing file: ${tempFile} ${err}`)
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

async function transform (sourcePath, opts) {
  const logPrefix = `transform(${sourcePath}):`
  const ignoreOrReprocess = opts && (opts.ignoreErrors || (opts.reprocess && opts.reprocess.length > 0))
  logger.info(`${logPrefix} starting`)
  if (!m.hasProfiles(sourcePath)) {
    logger.warn(`${logPrefix} no profiles exist, not transforming`)
    return null
  }

  logger.info(`${logPrefix} extracting source and path...`)
  const { volume, pth } = extractVolumeAndPath(sourcePath)
  const source = await src.connect(volume)

  logger.debug(`${logPrefix}) fetching metadata...`)
  const derivedMeta = await manifest.deriveMetadata(source, pth)
  logger.debug(`${logPrefix}) fetched metadata`)
  if (derivedMeta && (derivedMeta.finished || (derivedMeta.status && derivedMeta.status.complete))) {
    if (ignoreOrReprocess) {
      logger.info(`${logPrefix}) metadata is finished/complete, but ignoredErrors was true or reprocess is not empty, proceeding...`)
    } else {
      logger.debug(`${logPrefix}) metadata is finished/complete, returning it`)
      return derivedMeta
    }
  }
  if (q.isQueued(sourcePath)) {
    if (q.isStaleJob(sourcePath)) {
      logger.warn(`${logPrefix} already queued (at ${q.cdate(sourcePath)}), but that was too long ago (> ${q.MAX_JOB_TIME}), re-submitting job...`)
    } else {
      if (ignoreOrReprocess) {
        logger.warn(`${logPrefix} already queued (at ${q.cdate(sourcePath)}), but ignoredErrors was true or reprocess is not empty, proceeding...`)
      } else {
        logger.warn(`${logPrefix} already queued (at ${q.cdate(sourcePath)}), not re-queueing`)
        return derivedMeta
      }
    }
  }

  logger.debug(`${logPrefix} adding to jobQueue: ${sourcePath}`)
  q.enqueue(sourcePath, opts)
  return derivedMeta
}

const { queueSystemDelete } = require('../util/delete')

const deleteAssetsForPath = async (sourceAndPath) => {
  queueSystemDelete(system.assetsDir(sourceAndPath), { recursive: true })
}

system.deletePathHandlers['xform'] = deleteAssetsForPath

export { transform }
