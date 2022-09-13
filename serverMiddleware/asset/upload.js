const fs = require('fs')
const { join } = require('path')
const shasum = require('shasum')
const Queue = require('bull')

const { basename } = require('path')
const cache = require('../util/cache')
const { deleteLocalFiles } = require('./cleanup')

const system = require('../util/config').SYSTEM
const logger = system.logger

const redisConfig = system.privateConfig.redis

const deleteIncompleteUploads = () => system.privateConfig.autoscan.deleteIncompleteUploads
const UPLOADS_CONCURRENCY = typeof process.env.YB_WORK_UPLOADS_CONCURRENCY === 'undefined'
  ? 2
  : +process.env.YB_WORK_UPLOADS_ENABLED

const UPLOAD_QUEUE_NAME = 'UploadAssetQueue'
const UPLOAD_JOB_NAME = 'UploadAssetJob'

const UPLOAD_CONFIRM_DELAY = 3000
const MAX_SIZE_DIFF_PCT = 0.0001

const UPLOAD_PROCESS_FUNCTION = async (uploadJob) => {
  const sourcePath = uploadJob.data.sourcePath
  const profile = uploadJob.data.profile
  const queueFile = uploadJob.data.file
  const jobPrefix = `[UPLOAD] ${uploadJob.data.jobPrefix}`
  const outfile = uploadJob.data.outfile
  const job = uploadJob.data.xformJob
  const overwrite = !!job.data.opts.overwrite
  if (UPLOADS_CONCURRENCY <= 0) {
    logger.info(`${jobPrefix} process.env.YB_WORK_UPLOADS_CONCURRENCY=${process.env.YB_WORK_UPLOADS_CONCURRENCY} <= 0, not uploading`)
    return
  }
  try {
    const outfileStat = fs.lstatSync(outfile, { throwIfNoEntry: false })
    if (!outfileStat || !outfileStat.size) {
      logger.error(`${jobPrefix}_uploadAsset_outfile_does_not_exist_or_has_zero_size`)
      return
    }
    const outfileSize = outfileStat.size
    const destPath = system.assetsDir(sourcePath) + basename(outfile)
    if (!overwrite) {
      const preHead = await system.api.safeMetadata(destPath)
      if (preHead) {
        // file exists -- is it roughly the same size?
        if (Math.abs(preHead.size - outfileSize) <= Math.floor(MAX_SIZE_DIFF_PCT * outfileSize)) {
          logger.info(`${jobPrefix}_SUCCESS_uploading_asset_already_exists: ${outfile}`)
          return
        }
      }
    }
    const fileUp = fs.createReadStream(outfile)
    logger.debug(`uploadAsset(${destPath}): uploading asset ${outfile} to destPath=${destPath}`)

    if (await system.api.write(destPath, fileUp) !== outfileSize) {
      logger.error(`uploadAsset(${destPath}): error uploading asset (upload failed)`)
      if (deleteIncompleteUploads()) {
        await system.api.remove(destPath)
      } else {
        logger.warn(`${jobPrefix} deleteIncompleteUploads disabled, retaining ${destPath}`)
      }
      return message
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            // ensure it was uploaded
            const head = await system.api.safeMetadata(destPath)
            if (head && head.size && head.size === outfileSize) {
              // upload success!
              logger.info(`uploadAsset(${destPath}): uploaded ${outfile} to destPath=${destPath}`)
              await system.touchLastModified(sourcePath)
              await cache.flushMetadata(sourcePath)
              if (queueFile) {
                try {
                  const uploadJobFileStat = fs.lstatSync(queueFile, { throwIfNoEntry: false })
                  if (uploadJobFileStat) {
                    logger.debug(`${jobPrefix} removing queueFile=${queueFile}`)
                    fs.rmSync(queueFile)
                  }
                } catch (err) {
                  const message = `${jobPrefix} error checking/removing queueFile=${queueFile}`
                  logger.error(message)
                  reject(message)
                }
              }
              deleteLocalFiles(outfile, profile, job, jobPrefix)
              resolve(null)
            } else {
              logger.error(`${jobPrefix} uploadAsset(${destPath}): error uploading asset (size mismatch): ${outfile} = ${outfileSize}, head=${JSON.stringify(head)}`)
              if (deleteIncompleteUploads()) {
                await system.api.remove(destPath)
              } else {
                logger.warn(`${jobPrefix} deleteIncompleteUploads disabled, retaining ${destPath}`)
              }
              reject(message)
            }
          } catch (e) {
            logger.error(`uploadAsset(${destPath}): unexpected error: ${e}`)
            if (deleteIncompleteUploads()) {
              await system.api.remove(destPath)
            } else {
              logger.warn(`${jobPrefix} deleteIncompleteUploads disabled, retaining ${destPath}`)
            }
            reject(message)
          }
        }, UPLOAD_CONFIRM_DELAY)
      })
    }
  } catch (e) {
    logger.error(`UPLOAD_PROCESS_FUNCTION: error uploading asset ${outfile}: ${e}`)
    throw e
  }
}

let UPLOAD_QUEUE = null
const uploadQueue = () => {
  if (UPLOAD_QUEUE === null) {
    if (UPLOADS_CONCURRENCY > 0) {
      UPLOAD_QUEUE = new Queue(UPLOAD_QUEUE_NAME, `redis://${redisConfig.host}:${redisConfig.port}`)
      UPLOAD_QUEUE.process(UPLOAD_JOB_NAME, UPLOADS_CONCURRENCY, UPLOAD_PROCESS_FUNCTION)
    }
  }
  return UPLOAD_QUEUE
}

const UPLOAD_QUEUE_DIR = system.workbenchDir + 'uploads/'

function queueUploadAsset (sourcePath, profile, outfile, xformJob, jobPrefix) {
  const job = {
    ctime: Date.now(),
    sourcePath,
    profile,
    outfile,
    xformJob,
    jobPrefix,
    file: UPLOAD_QUEUE_DIR + `${Date.now()}_${shasum(outfile + ':' + profile + ':' + JSON.stringify(xformJob))}.json`
  }
  fs.writeFileSync(job.file, JSON.stringify(job))
  if (UPLOADS_CONCURRENCY > 0) {
    uploadQueue().add(UPLOAD_JOB_NAME, job)
  }
  return job
}

const MAX_UPLOADS_AT_START = +process.env.YB_WORK_MAX_UPLOADS_AT_START || 50000

const uploadPendingAssets = () => {
  logger.info(`uploadPendingAssets starting with UPLOAD_QUEUE_DIR=${UPLOAD_QUEUE_DIR} and UPLOADS_CONCURRENCY=${UPLOADS_CONCURRENCY}`)
  try {
    fs.mkdirSync(UPLOAD_QUEUE_DIR, { recursive: true })
  } catch (e) {
    logger.error(`uploadPendingAssets: error creating UPLOAD_QUEUE_DIR=${UPLOAD_QUEUE_DIR}: ${e}`)
    throw e
  }

  if (UPLOADS_CONCURRENCY > 0) {
    try {
      logger.info(`uploadPendingAssets: listing files in ${UPLOAD_QUEUE_DIR} ...`)
      const files = fs.readdirSync(UPLOAD_QUEUE_DIR)
      logger.info(`uploadPendingAssets: re-queuing ${files.length} files`)
      let i
      for (i = 0; i < files.length && i < MAX_UPLOADS_AT_START; i++) {
        const f = files[i]
        try {
          uploadQueue().add(UPLOAD_JOB_NAME, JSON.parse(fs.readFileSync(join(UPLOAD_QUEUE_DIR, f)).toString('utf8')))
        } catch (err) {
          logger.error(`uploadPendingAssets: error reading/parsing file ${f}: ${err}`)
        }
      }
      if (i !== files.length) {
        logger.warn(`uploadPendingAssets: queued MAX_UPLOADS_AT_START=${MAX_UPLOADS_AT_START} uploads, ${files.length - MAX_UPLOADS_AT_START} uploads remain for the next app restart`)
      }
    } catch (e) {
      logger.error(`uploadPendingAssets: error queuing files for upload: ${e}`)
    }
  } else {
    logger.warn(`uploadPendingAssets: UPLOADS_CONCURRENCY=${UPLOADS_CONCURRENCY}, not looking for pending assets to upload`)
  }
}

export { queueUploadAsset, uploadPendingAssets }
