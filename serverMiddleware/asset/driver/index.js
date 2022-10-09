const system = require('../../util/config').SYSTEM
const logger = system.logger

const _drivers = {}

const loadMediaDriver = (mediaType) => {
  if (typeof _drivers[mediaType] === 'undefined') {
    const driverPath = `./${mediaType}`
    try {
      _drivers[mediaType] = require(driverPath)
    } catch (e) {
      logger.error(`loadMediaDriver(${mediaType}) error: ${e}`)
      _drivers[mediaType] = null
    }
  }
  return _drivers[mediaType]
}

export { loadMediaDriver }
