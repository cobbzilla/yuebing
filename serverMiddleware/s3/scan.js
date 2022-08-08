const nuxt = require('../../nuxt.config')
const video = require('../asset/xform')
const m = require('../../shared/media')
const s3util = require('./s3util')

const AUTOSCAN_MINIMUM_INTERVAL = 1000 * 60
const AUTOSCAN_MINIMUM_INITIAL_DELAY = 1000 * 5

let CURRENT_AUTOSCAN_START = null
let AUTOSCAN_COUNT = 1

// autoscan
function autoscan () {
  const logPrefix = `autoscan[${AUTOSCAN_COUNT}]:`
  AUTOSCAN_COUNT++
  console.log(`${logPrefix} starting`)
  if (CURRENT_AUTOSCAN_START) {
    console.warn(`${logPrefix} another scan is still running (started at ${CURRENT_AUTOSCAN_START}, not running`)
  } else {
    try {
      CURRENT_AUTOSCAN_START = new Date()
      scan('', true)
        .then((transforms) => {
          console.log(`${logPrefix} scan completed: transforms=${JSON.stringify(transforms)}`)
        },
        (err) => {
          console.error(`${logPrefix} scan error: ${err}`)
        })
    } catch (err) {
      console.error(`${logPrefix} error scanning: ${err}`)
    } finally {
      console.log(`${logPrefix} finalizing: setting CURRENT_AUTOSCAN_START = null`)
      CURRENT_AUTOSCAN_START = null
    }
  }
}

const AUTOSCAN = nuxt.default.privateRuntimeConfig.autoscan
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

async function scan (prefix, autoscan = false) {
  const results = await s3util.listSource(prefix, true)
  const transforms = []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    if (m.hasProfiles(result.name)) {
      console.log(`>>>>> SCAN: queueing source: ${result.name}`)
      transforms.push(result)
      if (autoscan) {
        // perform synchronously for autoscan
        video.transform(result.name).then((meta) => {
          console.log(`SYNC-TRANSFORM-RESULT (${result.name}) = ${JSON.stringify(meta)}`)
        })
      } else {
        // asynchronously for regular scan
        setTimeout(() => {
          video.transform(result.name).then((meta) => {
            console.log(`ASYNC-TRANSFORM-RESULT (${result.name}) = ${JSON.stringify(meta)}`)
          })
        }, 250)
      }
    }
  }
  return transforms
}

export default {
  path: '/s3/scan',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`'>>>>> API: Scanning ${req.url}, prefix = ${prefix}`)
    const transforms = await scan(prefix)
    res.end(JSON.stringify(transforms))
  }
}
