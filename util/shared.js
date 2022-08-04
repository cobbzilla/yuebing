//
// This is the only JS file that both client and server side both reference
// As such, it should remain very simple. Declarative stuff. Nothing too fancy.
//
const nuxt = require('../nuxt.config')

const FILE_TYPE = 'file'
const DIRECTORY_TYPE = 'dir'

const VIDEO_MEDIA_TYPE = 'video'
const AUDIO_MEDIA_TYPE = 'audio'
const UNKNOWN_MEDIA_TYPE = 'binary'

const EXT_MAP = {}
const NUXT_CONFIG = nuxt
const MEDIA = nuxt.default.publicRuntimeConfig.media
for (const type in MEDIA) {
  if (MEDIA[type].ext && Array.isArray(MEDIA[type].ext)) {
    MEDIA[type].ext.forEach((e) => {
      EXT_MAP[e] = type
    })
  }
}

function mediaType (path) {
  if (typeof path !== 'string') {
    console.warn(`mediaType: unexpected arg: ${path} (as JSON=${JSON.stringify(path)})`)
    return UNKNOWN_MEDIA_TYPE
  }
  if (path.endsWith('/')) {
    return DIRECTORY_TYPE
  }
  const dotPos = path.lastIndexOf('.')
  const ext = (dotPos === -1 ? '' : path.substring(dotPos + 1)).toLowerCase()
  return ext in EXT_MAP ? EXT_MAP[ext] : UNKNOWN_MEDIA_TYPE
}

function mediaProfiles (path) {
  const type = mediaType(path)

  if (!(type in MEDIA)) {
    console.log(`mediaProfiles: mediaType ${type} does not define any config, path: ${path}`)
    return null
  }

  const typeConfig = MEDIA[type]
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
  const type = mediaType(path)
  if (!(type in MEDIA)) {
    console.log(`minFileSize: mediaType ${type} does not define any config (returning 0), path: ${path}`)
    return 0
  }
  const typeConfig = MEDIA[type]
  if (typeConfig.operations && operation in typeConfig.operations && typeConfig.operations[operation].minFileSize && typeConfig.operations[operation].minFileSize > 0) {
    return typeConfig.operations[operation].minFileSize
  }
  console.log(`getMinFileSize: mediaType ${type} does not define any minFileSize for operation ${operation} (returning 0), path: ${path}`)
  return 0
}

function hasMediaType (obj) {
  return obj.type && obj.type === 'file' &&
    obj.mediaType && obj.mediaType !== UNKNOWN_MEDIA_TYPE && obj.mediaType !== DIRECTORY_TYPE
}

function isDirectory (obj) {
  return obj.type && obj.type === DIRECTORY_TYPE
}

function isViewable (obj) {
  return obj.meta && obj.meta.status && obj.meta.status.ready
}

export {
  mediaType, mediaProfiles, hasProfiles, minFileSize,
  hasMediaType, isDirectory, isViewable,
  NUXT_CONFIG, MEDIA, FILE_TYPE, DIRECTORY_TYPE,
  VIDEO_MEDIA_TYPE, AUDIO_MEDIA_TYPE, UNKNOWN_MEDIA_TYPE
}
