const { M_FILE } = require('mobiletto-lite')

const system = require('../util/config').SYSTEM
const logger = system.logger

const src = require('../source/sourceUtil')
const m = require('../../shared/media')
const xform = require('../asset/xform')
const { extractSourceAndPathAndConnect } = require('../source/sourceUtil')

const AUTOSCAN_MINIMUM_INTERVAL = 1000 * 60
const AUTOSCAN_MINIMUM_INITIAL_DELAY = 1000 * 5

let CURRENT_AUTOSCAN_START = null
let AUTOSCAN_COUNT = 1

// todo: monitor `system.privateConfig.autoscan` for changes, cancel and recreate the interval
function initAutoscan (scanConfig) {
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
}

// autoscan
async function autoscan () {
  const logPrefix = `autoscan[${AUTOSCAN_COUNT}]:`
  AUTOSCAN_COUNT++
  if (AUTOSCAN_COUNT > 0) {
    logger.info(`${logPrefix} wtf disabled?`)
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
          scan(source, '', { autoscan: true })
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

async function scan (source, path = '', opts = { autoscan: false }) {
  let results
  logger.info(`scan(${path}) listing...`)
  results = await source.list(path, { recursive: true, quiet: true })
  if (!results) {
    logger.warn(`scan(${path}) no listing found, checking for single file`)
    const meta = source.safeMetadata(path)
    if (!meta) {
      logger.error(`scan(${path}) no listing found and no metadata for path, cannot scan`)
      return
    } else {
      logger.info(`scan(${path}) scanning single media item`)
      results = [meta]
    }
  }
  const force = opts && opts.force
  const autoscan = opts && opts.autoscan
  const transforms = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (result.type !== M_FILE) {
      continue
    }
    const jobName = source.name + '/' + result.name
    if (m.hasProfiles(jobName)) {
      logger.info(`>>>>> SCAN: queueing source: ${jobName}`)
      transforms.push(result)
      if (autoscan) {
        // perform synchronously for autoscan
        xform.transform(jobName, force).then((meta) => {
          logger.info(`SYNC-TRANSFORM-RESULT (${jobName}) = ${JSON.stringify(meta)}`)
        })
      } else {
        // asynchronously for regular scan
        setTimeout(() => {
          xform.transform(jobName, force).then((meta) => {
            logger.info(`ASYNC-TRANSFORM-RESULT (${jobName}) = ${JSON.stringify(meta)}`)
          })
        }, 250)
      }
    }
  }
  return transforms
}

const scanPath = async (sourceAndPath) => {
  const { source, pth } = await extractSourceAndPathAndConnect(sourceAndPath)
  return scan(source, pth, { autoscan: false, force: true })
}

module.exports = { scan, scanPath, initAutoscan }
