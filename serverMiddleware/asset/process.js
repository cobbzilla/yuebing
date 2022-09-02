const path = require('path')
const fs = require('fs')
const randomstring = require('randomstring')

const system = require('../util/config').SYSTEM
const logger = system.logger

const m = require('../../shared/media')
const src = require('../source/sourceUtil')
const util = require('../util/file')
const q = require('./job')

module.exports = XFORM_PROCESS_FUNCTION = (job, done) => {

  const ensureSourceDownloaded = async (job) => {
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
  const doneWrapper = {
    doneFunc: done,
    finished: false
  }
  doneWrapper.finish = () => {
    doneWrapper.doneFunc()
    doneWrapper.finished = true
  }
  ensureSourceDownloaded(job)
    .then(
      (file) => {
        if (file) {
          createArtifacts(job, file, doneWrapper)
            .then(
              () => { logger.debug(`createArtifacts(${job.data?.sourcePath}, ${file}): finished OK`) },
              (e) => { logger.error(`createArtifacts(${job.data?.sourcePath}, ${file}): error: ${e}`) }
            )
        }
      },
      (err) => { logger.error(`ensureSourceDownloaded(${job.data?.sourcePath}): error: ${err}`) }
    ).finally(() => {
    if (doneWrapper.finished) {
      logger.debug(`XFORM_PROCESS_FUNCTION(${job.data?.sourcePath}): finished OK`)
    } else {
      logger.warn(`XFORM_PROCESS_FUNCTION(${job.data?.sourcePath}): did not finish OK, calling done()`)
      doneWrapper.finish()
    }
  })
}

