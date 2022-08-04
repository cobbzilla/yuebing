import fs from 'fs'

const shasum = require('shasum')
const nuxt = require('../nuxt.config')
const c = require('../util/shared')
const s3cfg = require('./s3/s3client')

const MAX_CONCURRENT_TRANSFORMS = 2

const workbenchDir = process.env.SV_WORK_DIR.endsWith('/')
  ? process.env.SV_WORK_DIR
  : process.env.SV_WORK_DIR + '/'

const XFORM_TRANSFORM_PREFIX = 'transform_'
const LAST_MODIFIED_FILE = 'lastModified'
const ERROR_FILE_PREFIX = '_error_'

const MULTIFILE_PLACEHOLDER = '%03d'
const MULTIFILE_FIRST = '001'

const EXT_MAP = {}
const mediaConfig = nuxt.default.privateRuntimeConfig.media
for (const type in mediaConfig) {
  if (mediaConfig[type].ext && Array.isArray(mediaConfig[type].ext)) {
    mediaConfig[type].ext.forEach((e) => {
      EXT_MAP[e] = type
    })
  }
}

function mediaType (path) {
  if (typeof path !== 'string') {
    console.warn(`mediaType: unexpected arg: ${path} (as JSON=${JSON.stringify(path)})`)
    return c.UNKNOWN_MEDIA_TYPE
  }
  if (path.endsWith('/')) {
    return c.DIRECTORY_TYPE
  }
  const dotPos = path.lastIndexOf('.')
  const ext = (dotPos === -1 ? '' : path.substring(dotPos + 1)).toLowerCase()
  return ext in EXT_MAP ? EXT_MAP[ext] : c.UNKNOWN_MEDIA_TYPE
}

function mediaProfiles (path) {
  const mediaConfig = nuxt.default.privateRuntimeConfig.media
  const type = mediaType(path)

  if (!(type in mediaConfig)) {
    console.log(`mediaProfiles: mediaType ${type} does not define any config, path: ${path}`)
    return null
  }

  const typeConfig = mediaConfig[type]
  if (typeof typeConfig.profiles !== 'object' || Object.keys(typeConfig.profiles).length === 0) {
    console.log(`mediaProfiles: no media profiles exist for mediaType ${type}, path: ${path}`)
    return null
  }

  // ensure profile objects have their name as a property
  Object.keys(typeConfig.profiles).forEach((p) => {
    if (typeof typeConfig.profiles[p].name === 'undefined') {
      typeConfig.profiles[p].name = p
    }
  })

  return typeConfig.profiles
}

function hasProfiles (path) {
  return mediaProfiles(path) != null
}

function minFileSize (path, operation) {
  const mediaConfig = nuxt.default.privateRuntimeConfig.media
  const type = mediaType(path)
  if (!(type in mediaConfig)) {
    console.log(`minFileSize: mediaType ${type} does not define any config (returning 0), path: ${path}`)
    return 0
  }
  const typeConfig = mediaConfig[type]
  if (typeConfig.operations && operation in typeConfig.operations && typeConfig.operations[operation].minFileSize && typeConfig.operations[operation].minFileSize > 0) {
    return typeConfig.operations[operation].minFileSize
  }
  console.log(`getMinFileSize: mediaType ${type} does not define any minFileSize for operation ${operation} (returning 0), path: ${path}`)
  return 0
}

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
  canonicalSourceFile, canonicalWorkingDir, canonicalDestDir,
  deleteFile, statSize, mediaType, mediaProfiles, hasProfiles, minFileSize,
  workbenchDir, MAX_CONCURRENT_TRANSFORMS,
  MULTIFILE_PLACEHOLDER, MULTIFILE_FIRST,
  XFORM_TRANSFORM_PREFIX, LAST_MODIFIED_FILE, ERROR_FILE_PREFIX
}
