const FILE_TYPE = 'file'
const DIRECTORY_TYPE = 'dir'

const VIDEO_MEDIA_TYPE = 'video'
const AUDIO_MEDIA_TYPE = 'audio'
const UNKNOWN_MEDIA_TYPE = 'binary'

const ASSET_PREFIX = 'asset_'

function assetSuffix (mediaType) {
  return `@${mediaType}@`
}

const EXT_MAP = {}

const MEDIA = {
  standard: require('./media/standard').default,
  video: require('./media/video.js').default
}

function resolveFrom (profile, profileMap) {
  if (typeof profile.from !== 'string') {
    return profile
  }
  if (!(profile.from in profileMap)) {
    throw new TypeError(`resolveFrom: cannot resolve from ${profile.from} for profile ${profile.name}`)
  }
  return Object.assign({}, resolveFrom(profileMap[profile.from], profileMap), profile)
}

for (const type in MEDIA) {
  // Build extension map
  const typeConfig = MEDIA[type]
  if (typeConfig.ext && Array.isArray(typeConfig.ext)) {
    typeConfig.ext.forEach((e) => {
      EXT_MAP[e] = type
    })
  }

  // If mediaType includes a 'from' property, copy operations and profiles
  // from that mediaType into this one (e.g. 'standard')
  if (typeConfig.from) {
    if (MEDIA[typeConfig.from]) {
      const fromConfig = MEDIA[typeConfig.from]
      Object.assign(typeConfig.operations, fromConfig.operations)
      Object.assign(typeConfig.profiles, fromConfig.profiles)
    } else {
      throw new TypeError(`Cannot parse mediaType ${type}: 'from' mediaType not found: ${typeConfig.from}`)
    }
  }

  // Process profiles to handle a few preparatory tasks:
  //  * Populate the 'name' property for each profile object
  //  * Populate the 'mediaType' property for each profile object
  //  * Define 'enabled: true' for profiles that do not have an 'enabled' property
  //  * Expand the magic 'from' property where found
  //  * Expand the magic 'subProfiles' property where found
  if (typeConfig.profiles && Object.keys(typeConfig.profiles).length > 0) {
    const typeProfiles = []
    const typeProfileMap = {}
    // Make a copy to avoid overwrites & simplify resolveFrom work
    // This loop also assigns the 'name' property
    Object.keys(typeConfig.profiles).forEach((profileName) => {
      const profile = typeConfig.profiles[profileName]
      profile.name = profileName
      profile.mediaType = type
      if (typeof profile.enabled !== 'boolean' && typeof profile.from === 'undefined') {
        profile.enabled = true
      }
      typeProfiles.push(profile)
      typeProfileMap[profileName] = profile
    })
    typeProfiles.forEach((profile) => {
      typeConfig.profiles[profile.name] = resolveFrom(profile, typeProfileMap)
    })
    typeProfiles.forEach((profile) => {
      if (Array.isArray(typeConfig.profiles[profile.name].subProfiles)) {
        const subProfiles = typeConfig.profiles[profile.name].subProfiles
        const subProfileObjects = []
        subProfiles.forEach((subProfile) => {
          subProfileObjects.push(typeConfig.profiles[subProfile])
        })
        typeConfig.profiles[profile.name].subProfiles = subProfileObjects
      }
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

function mediaProfileByName (mediaType, profileName) {
  return MEDIA[mediaType].profiles[profileName]
}

function mediaProfilesForSource (path) {
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
  return mediaProfilesForSource(path) != null
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

function profileNameFromAsset (asset) {
  if (typeof asset !== 'string') {
    const message = `profileFromAsset: expected string argument, got: ${asset} (type=${typeof asset})`
    console.error(message)
    throw new TypeError(message)
  }
  const prefix = asset.indexOf(ASSET_PREFIX)
  const suffix = asset.indexOf(assetSuffix(mediaType(asset)), prefix === -1 ? 0 : prefix)
  if (prefix === -1 || suffix === -1) {
    const message = `profileFromAsset: cannot determine profile from asset with invalid name: ${asset}`
    console.error(message)
    throw new TypeError(message)
  }
  const profile = asset.substring(prefix + ASSET_PREFIX.length, suffix)
  console.log(`profileFromAsset(${asset}) returning '${profile}'`)
  return profile
}

function profileFromAsset (mediaType, asset) {
  return MEDIA[mediaType][profileNameFromAsset(asset)]
}

// standard operations
const OP_TRANSCODE = 'transcode'
const OP_DASH = 'dash'
const OP_THUMBNAILS = 'thumbnails'
const OP_FIRST_THUMBNAIL = 'firstThumbnail'
const OP_MEDIAINFO = 'mediainfo'

function isThumbnailProfile (profile) {
  return profile.operation === OP_THUMBNAILS || profile.operation === OP_FIRST_THUMBNAIL
}

function isMediaInfoJsonProfile (profile) {
  return profile.operation === OP_MEDIAINFO && profile.ext === 'json'
}

export {
  mediaType, mediaProfilesForSource, hasProfiles, minFileSize,
  hasMediaType, isDirectory, isViewable,
  profileNameFromAsset, mediaProfileByName, profileFromAsset,
  isThumbnailProfile, isMediaInfoJsonProfile,
  MEDIA, FILE_TYPE, DIRECTORY_TYPE,
  VIDEO_MEDIA_TYPE, AUDIO_MEDIA_TYPE, UNKNOWN_MEDIA_TYPE,
  ASSET_PREFIX, assetSuffix,
  OP_THUMBNAILS, OP_FIRST_THUMBNAIL, OP_MEDIAINFO,
  OP_DASH, OP_TRANSCODE
}
