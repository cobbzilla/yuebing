import fs from 'fs'

const shasum = require('shasum')
const s3cfg = require('../s3/s3client')

const MAX_CONCURRENT_TRANSFORMS = 2

const workbenchDir = process.env.SV_WORK_DIR.endsWith('/')
  ? process.env.SV_WORK_DIR
  : process.env.SV_WORK_DIR + '/'

const LAST_MODIFIED_FILE = 'lastModified'
const ERROR_FILE_PREFIX = '_error_'

const MULTIFILE_PLACEHOLDER = '%03d'
const MULTIFILE_FIRST = '001'

function statSize (file) {
  const stats = fs.statSync(file, { throwIfNoEntry: false })
  if (stats && stats.size) {
    return stats.size
  }
  console.error('statSize error on file ' + file)
  return -1
}

function canonicalWorkingDir (path) {
  // replace all nonalphanumeric chars with underscores
  const scrubbed = path.replace(/[\W_]+/g, '_')
  // retain the first 20 characters, then add a hash
  const canonical = (scrubbed.length < 20 ? scrubbed : scrubbed.substring(0, 20)) + '_' + shasum(path) + '/'
  // console.log('canonicalWorkingDir(' + path + ') returning ' + canonical)
  return canonical
}

function canonicalDestDir (path) {
  // replace all nonalphanumeric chars with underscores
  const scrubbed = path.replace(/[\W_]+/g, '_')
  // retain the first 20 characters, then add a hash
  const sha = shasum(path)
  const rawPrefix = s3cfg.destBucketParams.Prefix
  const prefix = rawPrefix.endsWith('/') ? rawPrefix : rawPrefix + '/'
  const slug = (scrubbed.length < 20 ? scrubbed : scrubbed.substring(0, 20)) + '_' + sha
  const canonical = prefix + sha.substring(0, 2) +
    '/' + sha.substring(2, 4) +
    '/' + sha.substring(4, 6) +
    '/' + slug +
    '/'
  // console.log('canonicalDestDir(' + path + ') returning ' + canonical)
  return canonical
}

function canonicalSourceFile (path) {
  const base = path.endsWith('/') ? path.substring(0, path.length - 1) : path
  const slash = base.lastIndexOf('/')
  const file = slash === -1 ? base : base.substring(slash)
  const dot = file.lastIndexOf('.')
  const ext = dot === -1 || dot === file.length - 1 ? '' : file.substring(dot + 1)
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

export {
  canonicalSourceFile, canonicalWorkingDir, canonicalDestDir, deleteFile, statSize,
  workbenchDir, MAX_CONCURRENT_TRANSFORMS,
  MULTIFILE_PLACEHOLDER, MULTIFILE_FIRST,
  LAST_MODIFIED_FILE, ERROR_FILE_PREFIX
}
