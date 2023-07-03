const { M_FILE } = require('mobiletto-lite')
const { AUTOSCAN_MINIMUM_INTERVAL, AUTOSCAN_MINIMUM_INITIAL_DELAY } = require('../../shared/type/scanType')
const system = require('../util/config').SYSTEM
const logger = system.logger

const vol = require('../model/morm/volumeDb')
const m = require('../../shared/media')
const shared_vol = require('../../shared/type/volumeType')
const xform = require('../asset/xform')
const { uploadPendingAssets } = require('../asset/upload')

let CURRENT_AUTOSCAN_START = null
let AUTOSCAN_COUNT = 1
let AUTOSCAN_INTERVAL_OBJ = null

function registerAutoscanInterval (interval) {
  AUTOSCAN_INTERVAL_OBJ = setInterval(async () => {
    if (system.privateConfig.autoscan.interval !== interval) {
      if (AUTOSCAN_INTERVAL_OBJ) {
        logger.info(`registerAutoscanInterval: canceling old autoscan interval (${interval})`)
        clearInterval(AUTOSCAN_INTERVAL_OBJ)
      }
      logger.info(`registerAutoscanInterval: registering new autoscan interval (${system.privateConfig.autoscan.interval})`)
      registerAutoscanInterval(system.privateConfig.autoscan.interval)
    }
    await autoscan()
  }, Math.max(interval, AUTOSCAN_MINIMUM_INTERVAL))
}

function initAutoscan () {
  const scanConfig = system.privateConfig.autoscan
  logger.info(`initAutoScan: initializing with scanConfig=${JSON.stringify(scanConfig)}`)
  const initialDelay = Math.max(scanConfig.initialDelay, AUTOSCAN_MINIMUM_INITIAL_DELAY)
  setTimeout(() => {
    registerAutoscanInterval(system.privateConfig.autoscan.interval)
  }, initialDelay)
  logger.info(`initAutoScan: uploading pending assets...`)
  uploadPendingAssets().then(() => { logger.info('initAutoscan: uploadPendingAssets finished') })
}

function shouldScan (library, now) {
  if (!library.autoscan || library.autoscan.enabled !== true || !library.autoscan.interval) {
    // autoscan not defined
    return false
  }
  if (typeof(library.autoscan.lastScanStarted) === 'undefined') {
    // autoscan has not been run (since last library edit)
    return true
  }
  if (typeof(library.autoscan.lastScanStarted) === 'number') {
    // autoscan has been started at least once
    if (typeof(library.autoscan.lastScanEnded) === 'undefined') {
      // autoscan started but not finished, do not scan again
      return false
    }
    if (typeof(library.autoscan.lastScanEnded) === 'number') {
      return now - library.autoscan.lastScanEnded > library.autoscan.interval
    }
  }
  // unknown lastScanStarted value
  return false
}

// autoscan
async function autoscan () {
  const logPrefix = `autoscan[${AUTOSCAN_COUNT}]:`
  AUTOSCAN_COUNT++
  logger.info(`${logPrefix} starting`)
  const sourcesToScan = {} // map of source -> libraries using the source
  const now = Date.now()

  // 1. find all libraries
  const libraries = await vol.volumeDb.list()
  if (libraries && libraries.length > 0) {
    for (const library of libraries) {
      // 2. for each library, add source to scan list if most recent scan time is too old for library scan interval
      if (shouldScan(library, now)) {
        for (const source of library.sources) {
          if (!(source in sourcesToScan)) {
            sourcesToScan[source] = []
          }
          sourcesToScan[source].push(library)
        }
      }
    }
  } else {
    // 3. if no libraries, add all sources to scan list
    for (const source of shared_vol.filterSources(vol.volumeDb.list()).map(s => s.name)) {
      sourcesToScan[source] = []
    }
  }

  const sourcesScanned = []
  for (const sourceName of sourcesToScan) {
    const scanPrefix = `${logPrefix} (source ${sourceName}) `
    try {
      // 4. scanning each source

      // 4a. check for 'scan' JSON object for source

      //     - if we have scanned more recently than library scan interval, skip scan
      const source = await vol.volumeDb.connect(sourceName)
      await scan(source, { autoscan: true })
      // 4b. if we need to scan the source, create/update the 'scan' JSON object for source with start time
      // 4b. scan the source
      // 4c. update 'scan' JSON object, set scan completion time for source
      // 4d. for each library associated with the source: if all sources for the library have been scanned, mark the library as scanned
    } catch (err) {
      logger.error(`${scanPrefix} error scanning: ${err}`)
    } finally {
      logger.info(`${scanPrefix} finalizing: setting CURRENT_AUTOSCAN_START = null`)
      CURRENT_AUTOSCAN_START = null
    }
  }

    if (CURRENT_AUTOSCAN_START) {
      logger.warn(`${logPrefix} another scan is still running (started at ${CURRENT_AUTOSCAN_START}, not running`)
    } else {
      const sources = vol.connectedSources()
      if (sources.length === 0) {
        logger.warn(`${logPrefix} no sources, nothing to scan`)
        return
      }
      for (const sourceName of sources) {
        const source = await vol.volumeDb.connect(sourceName)
        const scanPrefix = `${logPrefix} (source ${sourceName}) `
          CURRENT_AUTOSCAN_START = new Date()
          scan(source, { autoscan: true })
            .then((transforms) => {
              logger.info(`${scanPrefix} scan completed: transforms=${JSON.stringify(transforms)}`)
            },
            (err) => { logger.error(`${scanPrefix} scan error: ${err}`) })
      }
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
    const { volume, pth } = await vol.extractVolumeAndPathAndConnect(sourceAndPath)
    const source = volume
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
