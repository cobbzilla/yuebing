const m = require('../../../shared/media')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const u = require('../../user/userUtil')
const video = require('../../asset/xform')
const src = require('../../source/sourceUtil')

const AUTOSCAN_MINIMUM_INTERVAL = 1000 * 60
const AUTOSCAN_MINIMUM_INITIAL_DELAY = 1000 * 5

let CURRENT_AUTOSCAN_START = null
let AUTOSCAN_COUNT = 1

// autoscan
async function autoscan () {
  const logPrefix = `autoscan[${AUTOSCAN_COUNT}]:`
  AUTOSCAN_COUNT++
  console.log(`${logPrefix} starting`)
  try {
    if (CURRENT_AUTOSCAN_START) {
      console.warn(`${logPrefix} another scan is still running (started at ${CURRENT_AUTOSCAN_START}, not running`)
    } else {
      const sources = src.connectedSources()
      if (sources.length === 0) {
        console.warn(`${logPrefix} no sources, nothing to scan`)
        return
      }
      for (const sourceName of sources) {
        const source = await src.connect(sourceName)
        const scanPrefix = `${logPrefix} (source ${sourceName}) `
        try {
          CURRENT_AUTOSCAN_START = new Date()
          scan(source, true)
            .then((transforms) => {
              console.log(`${scanPrefix} scan completed: transforms=${JSON.stringify(transforms)}`)
            },
            (err) => { console.error(`${scanPrefix} scan error: ${err}`) })
        } catch (err) {
          console.error(`${scanPrefix} error scanning: ${err}`)
        } finally {
          console.log(`${scanPrefix} finalizing: setting CURRENT_AUTOSCAN_START = null`)
          CURRENT_AUTOSCAN_START = null
        }
      }
    }
  } finally {
    console.log(`${logPrefix} finished`)
  }
}

const AUTOSCAN = system.privateConfig.autoscan
if (AUTOSCAN.enabled) {
  if (AUTOSCAN.interval > 0) {
    const autoScanInterval = Math.max(AUTOSCAN.interval, AUTOSCAN_MINIMUM_INTERVAL)
    setInterval(() => autoscan(), autoScanInterval) // regular autoscan interval
  } else {
    console.warn(' ~~~ AUTOSCAN (periodic) is disabled ~~~')
  }
  if (AUTOSCAN.initialDelay > 0) {
    const initialDelay = Math.max(AUTOSCAN.initialDelay, AUTOSCAN_MINIMUM_INITIAL_DELAY)
    setTimeout(() => autoscan(), initialDelay) // start an initial scan soon
  } else {
    console.warn(' ~~~ AUTOSCAN (initial) is disabled ~~~')
  }
}

async function scan (source, path, autoscan = false) {
  const results = await source.list(path)
  const transforms = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const jobName = source.name + '/' + result.name
    if (m.hasProfiles(jobName)) {
      console.log(`>>>>> SCAN: queueing source: ${jobName}`)
      transforms.push(result)
      if (autoscan) {
        // perform synchronously for autoscan
        video.transform(jobName).then((meta) => {
          console.log(`SYNC-TRANSFORM-RESULT (${jobName}) = ${JSON.stringify(meta)}`)
        })
      } else {
        // asynchronously for regular scan
        setTimeout(() => {
          video.transform(jobName).then((meta) => {
            console.log(`ASYNC-TRANSFORM-RESULT (${jobName}) = ${JSON.stringify(meta)}`)
          })
        }, 250)
      }
    }
  }
  return transforms
}

export default {
  path: '/api/source/scan',
  async handler (req, res) {
    const user = await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const { source, path } = await src.extractSourceAndPathAndConnect(req.url)
    if (!source || !path) { return api.notFound() }
    console.log(`>>>>> API: Scanning ${req.url}, source=${source.name}, prefix = ${path}`)
    const transforms = await scan(source, path)
    return api.okJson(res, transforms)
  }
}
