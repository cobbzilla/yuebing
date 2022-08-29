const fs = require('fs')
const shasum = require('shasum')
const system = require('./config').SYSTEM
const logger = system.logger

function statSize (file) {
  const stats = fs.statSync(file, { throwIfNoEntry: false })
  if (stats && stats.size) {
    return stats.size
  }
  return -1
}

function deleteFile (path) {
  fs.unlink(path, (err) => {
    if (err) {
      logger.error('Error deleting path: ' + path)
    }
  })
}

const REDIS_META_PREFIX = 'CACHED_META_'

function redisMetaCacheKey (sourcePath) {
  return REDIS_META_PREFIX + shasum(sourcePath)
}

module.exports = {
  deleteFile,
  statSize,
  redisMetaCacheKey
}
