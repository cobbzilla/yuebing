const { M_FILE } = require('mobiletto-lite')

const system = require('../util/config').SYSTEM
const logger = system.logger

const src = require('../source/sourceUtil')
const m = require('../../shared/media')
const xform = require('../asset/xform')
const { uploadPendingAssets } = require('../asset/upload')
const { extractSourceAndPathAndConnect } = require('../source/sourceUtil')

const AUTOSCAN_MINIMUM_INTERVAL = 1000 * 60
const AUTOSCAN_MINIMUM_INITIAL_DELAY = 1000 * 5

let CURRENT_AUTOSCAN_START = null
let AUTOSCAN_COUNT = 1

// todo: monitor `system.privateConfig.autoscan` for changes, cancel and recreate the interval
function initAutoscan (scanConfig) {
  logger.info(`initAutoScan: initializing with scanConfig=${JSON.stringify(scanConfig)}`)
  if (scanConfig.enabled) {
    if (scanConfig.interval > 0) {
      const autoScanInterval = Math.max(scanConfig.interval, AUTOSCAN_MINIMUM_INTERVAL)
      setInterval(() => autoscan(), autoScanInterval) // regular autoscan interval
    } else {
      logger.warn(' ~~~ AUTOSCAN (periodic) is disabled ~~~')
    }
    if (scanConfig.initialDelay > 0) {
      const initialDelay = Math.max(scanConfig.initialDelay, AUTOSCAN_MINIMUM_INITIAL_DELAY)
      setTimeout(() => autoscan(), initialDelay) // start an initial scan soon
    } else {
      logger.warn(' ~~~ AUTOSCAN (initial) is disabled ~~~')
    }
  }
  logger.info(`initAutoScan: uploading pending assets...`)
  uploadPendingAssets().then(() => { logger.info('initAutoscan: uploadPendingAssets finished') })
}

// autoscan
async function autoscan () {
  const logPrefix = `autoscan[${AUTOSCAN_COUNT}]:`
  AUTOSCAN_COUNT++
  if (AUTOSCAN_COUNT > 0) {
    logger.info(`${logPrefix} autoscan forcibly disabled, returning`)
    return
  }
  logger.info(`${logPrefix} starting`)
  try {
    if (CURRENT_AUTOSCAN_START) {
      logger.warn(`${logPrefix} another scan is still running (started at ${CURRENT_AUTOSCAN_START}, not running`)
    } else {
      const sources = src.connectedSources()
      if (sources.length === 0) {
        logger.warn(`${logPrefix} no sources, nothing to scan`)
        return
      }
      for (const sourceName of sources) {
        const source = await src.connect(sourceName)
        const scanPrefix = `${logPrefix} (source ${sourceName}) `
        try {
          CURRENT_AUTOSCAN_START = new Date()
          scan(source, { autoscan: true })
            .then((transforms) => {
              logger.info(`${scanPrefix} scan completed: transforms=${JSON.stringify(transforms)}`)
            },
            (err) => { logger.error(`${scanPrefix} scan error: ${err}`) })
        } catch (err) {
          logger.error(`${scanPrefix} error scanning: ${err}`)
        } finally {
          logger.info(`${scanPrefix} finalizing: setting CURRENT_AUTOSCAN_START = null`)
          CURRENT_AUTOSCAN_START = null
        }
      }
    }
  } finally {
    logger.info(`${logPrefix} finished`)
  }
}

async function scan (source, opts = {}) {
  const path = opts.path || ''
  const logPrefix = `scan(${path})`
  let results
  logger.info(`${logPrefix} listing...`)
  results = await source.list(path, { recursive: true, quiet: true })
  if (!results) {
    logger.warn(`scan(${path}) no listing found, checking for single file`)
    const meta = await source.safeMetadata(path)
    if (!meta) {
      logger.error(`scan(${path}) no listing found and no metadata for path, cannot scan`)
      return
    } else {
      logger.info(`scan(${path}) scanning single media item: ${JSON.stringify(meta)}`)
      results = [meta]
    }
  }

  const autoscan = opts && opts.autoscan
  const transforms = []
  for (let i = 0; i < results.length; i++) {
    const iterPrefix = `${logPrefix} [${i+1}/${results.length}]`
    const result = results[i]
    if (result.type !== M_FILE) {
      logger.info(`${iterPrefix} SKIPPING non-file result: ${JSON.stringify(result)}`)
      continue
    }
    const jobName = source.name + '/' + result.name
    if (m.hasProfiles(jobName)) {
      transforms.push(result)
      if (autoscan) {
        // perform synchronously for autoscan or force
        logger.info(`${iterPrefix} SYNC-QUEUING ${jobName}`)
        xform.transform(jobName, opts).then((meta) => {
          logger.info(`${iterPrefix} SYNC-TRANSFORM-RESULT (${jobName}) = ${JSON.stringify(meta)}`)
        })
      } else {
        // asynchronously for regular scan
        logger.info(`${iterPrefix} ASYNC-QUEUING ${jobName}`)
        setTimeout(() => {
          xform.transform(jobName, opts).then((meta) => {
            logger.info(`${iterPrefix} ASYNC-TRANSFORM-RESULT (${jobName}) = ${JSON.stringify(meta)}`)
          })
        }, 250)
      }
    } else {
      logger.warn(`scan(${path}) SKIPPING no profiles for [${i+1}/${results.length}]: ${JSON.stringify(result)}`)
    }
  }
  return transforms
}

const scanPath = async (scanConfig) => {
  const sourceAndPath = scanConfig.sourceAndPath
  const logPrefix = `scanPath(${sourceAndPath})`
  try {
    logger.info(`${logPrefix} extracting source and path`)
    const { source, pth } = await extractSourceAndPathAndConnect(sourceAndPath)
    scanConfig.path = pth
    logger.info(`${logPrefix} scanning with autoscan=false, force=true`)
    const scanResult = await scan(source, scanConfig)
    logger.info(`${logPrefix} scan returned: ${scanResult}`)
  } catch (e) {
    logger.error(`${logPrefix} error: ${e}`)
    throw e
  }
}

module.exports = { scan, scanPath, initAutoscan }
