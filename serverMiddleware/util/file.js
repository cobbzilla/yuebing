const fs = require('fs')

const shasum = require('shasum')
const c = require('../../shared')

const workbenchDir = process.env.YB_WORK_DIR
  ? process.env.YB_WORK_DIR.endsWith('/')
    ? process.env.YB_WORK_DIR
    : process.env.YB_WORK_DIR + '/'
  : '/tmp/'

function statSize (file) {
  const stats = fs.statSync(file, { throwIfNoEntry: false })
  if (stats && stats.size) {
    return stats.size
  }
  return -1
}

function canonicalWorkingDir (path) {
  return c.scrub(path) + '/'
}

function canonicalSourceFile (path) {
  const base = path.endsWith('/') ? path.substring(0, path.length - 1) : path
  const slash = base.lastIndexOf('/')
  const file = slash === -1 ? base : base.substring(slash)
  const ext = c.getExtension(file).toLowerCase()
  const canonical = 'source.' + ext
  return canonical
}

function deleteFile (path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.error('Error deleting path: ' + path)
    }
  })
}

const REDIS_META_PREFIX = 'CACHED_META_'

function redisMetaCacheKey (sourcePath) {
  return REDIS_META_PREFIX + shasum(sourcePath)
}

module.exports = {
  canonicalSourceFile,
  canonicalWorkingDir,
  deleteFile,
  statSize,
  redisMetaCacheKey,
  workbenchDir
}
