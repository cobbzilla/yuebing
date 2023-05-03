const c = require('../shared')

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

const MEDIA_TYPE_STANDARD = 'standard'
const MEDIA_TYPES = [MEDIA_TYPE_STANDARD, VIDEO_MEDIA_TYPE]

const MEDIA = {}
for (const mtype of MEDIA_TYPES) {
  MEDIA[mtype] = require(`./media/${mtype}`).default
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
  //  * Define 'func: <operation>_command' for profiles whose operations also have 'func: true'
  //  * Expand the magic 'from' property where found
  //  * Expand the magic 'subProfiles' property where found
  if (typeConfig.profiles && !c.empty(typeConfig.profiles)) {
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
      if (typeConfig.operations[profile.operation]
        && typeof typeConfig.operations[profile.operation].func === 'boolean'
        && typeof typeConfig.operations[profile.operation].func) {
        profile.func = profile.operation + '_command'
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
    try {
      console.warn(`mediaType: unexpected arg: ${path} (as JSON=${JSON.stringify(path)}): from ${new Error('trace').stack}`)
    } catch (e) {
      console.warn(`mediaType: unexpected arg: ${path} (as JSON had error: ${e})`)
    }
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
  if (MEDIA[mediaType] && MEDIA[mediaType].profiles && MEDIA[mediaType].profiles[profileName]) {
    return MEDIA[mediaType].profiles[profileName]
  } else {
    console.log(`mediaProfileByName(${profileName}) profile ${profileName} not found`)
    return undefined
  }
}

function mediaProfilesForSource (path) {
  const type = mediaType(path)

  if (!(type in MEDIA)) {
    console.log(`mediaProfiles: mediaType ${type} does not define any config, path: ${path}`)
    return null
  }

  const typeConfig = MEDIA[type]
  if (typeof typeConfig.profiles !== 'object' || c.empty(typeConfig.profiles)) {
    console.log(`mediaProfiles: no media profiles exist for mediaType ${type}, path: ${path}`)
    return null
  }

  // ensure profile objects have their name as a property
  const profileNames = Object.keys(typeConfig.profiles)
  profileNames.forEach((p) => {
    if (typeof typeConfig.profiles[p].name === 'undefined') {
      typeConfig.profiles[p].name = p
    }
  })

  const sortedProfileNames = typeConfig.from
    ? profileNames.sort((k1, k2) => k1 in MEDIA[typeConfig.from].profiles ? -1 : k2 in MEDIA[typeConfig.from].profiles ? 1 : 0)
    : profileNames
  const profiles = {}
  for (const n of sortedProfileNames) {
    profiles[n] = typeConfig.profiles[n]
  }
  return profiles
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

function newMediaObject (name, meta = null) {
  const type = mediaType(name)
  return type
    ? {
        name,
        type: type === DIRECTORY_TYPE ? DIRECTORY_TYPE : FILE_TYPE,
        mediaType: type,
        meta
      }
    : {
        name,
        type: name.endsWith('/') ? DIRECTORY_TYPE : FILE_TYPE,
        mediaType: name.endsWith('/') ? DIRECTORY_TYPE : UNKNOWN_MEDIA_TYPE,
        meta
      }
}

function hasMediaType (obj) {
  return obj.type && obj.type === 'file' &&
    obj.mediaType && obj.mediaType !== UNKNOWN_MEDIA_TYPE && obj.mediaType !== DIRECTORY_TYPE
}

const hasMediaInfo = obj => obj.mediainfo || metaHasMediaInfo(obj.meta)

const metaHasMediaInfo = meta => meta && meta.status && meta.status.info

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
  return MEDIA[mediaType] ? MEDIA[mediaType][profileNameFromAsset(asset)] : null
}

// standard operations
const OP_TRANSCODE = 'transcode'
const OP_DASH = 'dash'
const OP_THUMBNAILS = 'thumbnails'
const OP_FIRST_THUMBNAIL = 'firstThumbnail'
const OP_MEDIAINFO = 'mediainfo'

function isThumbnailProfile (profile) {
  return profile && profile.operation &&
    (profile.operation === OP_THUMBNAILS || profile.operation === OP_FIRST_THUMBNAIL)
}

function isMediaInfoJsonProfile (profile) {
  return profile && profile.operation && profile.ext &&
    profile.operation === OP_MEDIAINFO && profile.ext === 'json'
}

const objectEncodePath = path => path ? btoa(path).replaceAll('/', '_') : null
const objectDecodePath = encoded => encoded ? atob(encoded.replaceAll('_', '/')) : null

const PROFILE_ADDITIONAL_REGEXES = [...new Set(
  Object.keys(MEDIA)
    .map(t => !MEDIA[t].profiles
      ? []
      : Object.keys(MEDIA[t].profiles)
        .map(p => !MEDIA[t].profiles[p].additionalAssets
          ? []
          : MEDIA[t].profiles[p].additionalAssets
            .filter(a => !a.toString().startsWith('/' + ASSET_PREFIX) && !a.toString().startsWith('/^' + ASSET_PREFIX)))
        .flat())
    .flat())]

const ALL_MEDIA_PROFILES = Object.keys(MEDIA)
  .map(t => t === MEDIA_TYPE_STANDARD || !MEDIA[t].profiles
    ? []
    : Object.keys(MEDIA[t].profiles)
      .map((p) => { return { mediaType: t, profile: p, mediaTypeAndProfile: `${t} / ${p}` } }))
  .flat()

const bitrateInt = (rate) => {
  if (rate.toLowerCase().endsWith('m')) {
    return +(rate.substring(0, rate.length - 1) + '000000')
  } else if (rate.toLowerCase().endsWith('k')) {
    return +(rate.substring(0, rate.length - 1) + '000')
  } else if (c.isAllDigits(rate)) {
    return +rate
  } else {
    console.warn(`bitrateInt(${rate}) un-parseable rate`)
    return rate
  }
}

export {
  mediaType, mediaProfilesForSource, hasProfiles, minFileSize,
  newMediaObject, hasMediaType, hasMediaInfo, metaHasMediaInfo,
  profileNameFromAsset, mediaProfileByName, profileFromAsset,
  isThumbnailProfile, isMediaInfoJsonProfile,
  objectEncodePath, objectDecodePath,
  bitrateInt,
  PROFILE_ADDITIONAL_REGEXES, ALL_MEDIA_PROFILES,
  MEDIA, FILE_TYPE, DIRECTORY_TYPE,
  VIDEO_MEDIA_TYPE, AUDIO_MEDIA_TYPE, UNKNOWN_MEDIA_TYPE,
  ASSET_PREFIX, assetSuffix,
  OP_THUMBNAILS, OP_FIRST_THUMBNAIL, OP_MEDIAINFO,
  OP_DASH, OP_TRANSCODE
}
