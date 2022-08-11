import { isThumbnailProfile, mediaProfileByName, mediaType } from '@/shared/media'

const jp = require('jsonpath')

const META_FIELDS = {

  // fixme -- some of the less common ones are probably not correct and/or may require more JSONPaths in the find array
  // sort: 1xxx -- important/editable fields
  title: {
    sort: 1000,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Title']
  },
  artist: {
    sort: 1010,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Artist']
  },
  album_artist: {
    sort: 1020,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Album_Artist']
  },
  author: {
    sort: 1030,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Author']
  },
  composer: {
    sort: 1040,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Composer']
  },
  year: {
    sort: 1050,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Year']
  },
  copyright: {
    sort: 1060,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Copyright']
  },
  album: {
    sort: 1070,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Album']
  },
  movie: {
    sort: 1080,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Movie']
  },
  description: {
    sort: 1090,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Description']
  },
  comment: {
    sort: 1100,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Comment']
  },
  genre: {
    sort: 1110,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Genre']
  },
  location: {
    sort: 1120,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Location']
  },
  show: {
    sort: 1130,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Show']
  },
  episode: {
    sort: 1140,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Episode']
  },
  episode_sort: {
    sort: 1150,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Episode_Sort']
  },
  season: {
    sort: 1160,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Season']
  },
  lyrics: {
    sort: 1170,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Lyrics']
  },
  tags: {
    sort: 1500,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Tags'] // fixme: is this correct?
  },

  // sort: 2xxx -- important read-only fields
  duration: {
    sort: 2000,
    find: [
      '$.media.track[?(@.@type=="General")].Duration_String2',
      '$.media.track[?(@.@type=="General")].Duration_String2',
      '$.media.track[?(@.@type=="General")].Duration_String',
      '$.media.track[?(@.@type=="General")].Duration'
    ]
  },
  width: {
    sort: 2010,
    find: ['$.media.track[?(@.@type=="Video")].Width']
  },
  height: {
    sort: 2020,
    find: ['$.media.track[?(@.@type=="Video")].Height']
  },
  size: {
    sort: 2030,
    find: [
      '$.media.track[?(@.@type=="General")].FileSize_String4',
      '$.media.track[?(@.@type=="General")].FileSize_String3',
      '$.media.track[?(@.@type=="General")].FileSize_String2',
      '$.media.track[?(@.@type=="General")].FileSize_String1',
      '$.media.track[?(@.@type=="General")].FileSize_String',
      '$.media.track[?(@.@type=="General")].FileSize'
    ]
  },

  // sort: 3xxx -- less well-known fields
  videoTracks: {
    sort: 3000,
    find: ['$.media.track[?(@.@type=="General")].VideoCount']
  },
  audioTracks: {
    sort: 3010,
    find: ['$.media.track[?(@.@type=="General")].AudioCount']
  },
  format: {
    sort: 3020,
    find: ['$.media.track[?(@.@type=="General")].Format']
  },
  contentType: {
    sort: 3030,
    find: ['$.media.track[?(@.@type=="General")].InternetMediaType']
  },
  bitRate: {
    sort: 3040,
    find: ['$.media.track[?(@.@type=="General")].OverallBitRate']
  },
  frameRate: {
    sort: 3050,
    find: ['$.media.track[?(@.@type=="General")].FrameRate']
  },
  dateEncoded: {
    sort: 3060,
    find: ['$.media.track[?(@.@type=="General")].File_Modified_Date']
  }
}

const sortInfoFields = (f1, f2) => META_FIELDS[f1].sort - META_FIELDS[f2].sort

function mediaInfoFields () {
  return Object.keys(META_FIELDS).sort(sortInfoFields)
}

function editableMediaInfoFields () {
  return Object.keys(META_FIELDS).filter(k => META_FIELDS[k].editable).sort(sortInfoFields)
}

function mediaInfoField (field, mediainfo, userMediainfo) {
  if (userMediainfo && userMediainfo[field]) {
    return userMediainfo[field]
  }
  const candidates = META_FIELDS[field]
  if (candidates && candidates.find) {
    for (let i = 0; i < candidates.find.length; i++) {
      const candidate = candidates.find[i]
      const found = jp.query(mediainfo, candidate, 1)
      if (found && found.length && found.length > 0) {
        const value = found[0]
        return typeof value === 'string' ? value : JSON.stringify(value)
      }
    }
    // console.log(`mediaInfoField: field not found in mediainfo: ${field}`)
  } else {
    // console.warn(`mediaInfoField: invalid field: ${field}`)
  }
  return null
}

function hasAssets (obj) {
  return obj && obj.meta &&
  obj.meta.status &&
  obj.meta.status.ready &&
  typeof obj.meta.assets === 'object' &&
  Object.keys(obj.meta.assets).length > 0
}

function hasProfileAssets (obj, profile) {
  return obj.meta &&
    obj.meta.status &&
    obj.meta.status.ready &&
    typeof obj.meta.assets === 'object' &&
    Object.keys(obj.meta.assets).length > 0 &&
    obj.meta.assets[profile] &&
    obj.meta.assets[profile].length > 0
}

function profileAssets (obj, profile) {
  return hasProfileAssets(obj, profile) ? obj.meta.assets[profile] : null
}

// return the first asset in the list, or null if nothing found
const DEFAULT_FIND_ASSET_RETURNER =
  (obj, profile) => profile && hasProfileAssets(obj, profile)
    ? profileAssets(obj, profile)[0]
    : null

function findAsset (obj, matcher, returner = DEFAULT_FIND_ASSET_RETURNER) {
  if (!obj || !obj.meta || !(typeof obj.meta.assets === 'object') ||
    Object.keys(obj.meta.assets).length === 0) {
    return null
  }
  return returner(obj, Object.keys(obj.meta.assets).find((profile) => {
    const assets = obj.meta.assets[profile]
    return assets.length > 0 && matcher(assets, profile)
  }))
}

const isThumbnail = (name, profile) => {
  const mediaProfile = mediaProfileByName(mediaType(name), profile)
  return mediaProfile && isThumbnailProfile(mediaProfile)
}

function findThumbnail (obj) {
  let thumb = null
  if (hasAssets(obj)) {
    // Look for user-specified thumbnail first. If not found, then pick the first one
    if (obj.meta.selectedThumbnail) {
      thumb = obj.meta.selectedThumbnail
    } else {
      thumb = findAsset(obj, (assets, profile) => isThumbnail(obj.name, profile))
    }
  }
  return thumb
}

function findThumbnails (obj) {
  if (hasAssets(obj)) {
    const thumbs = []
    Object.keys(obj.meta.assets)
      .filter(profile => isThumbnail(obj.name, profile))
      .forEach(profile => thumbs.push(...obj.meta.assets[profile]))
    return thumbs
  }
  return []
}

export {
  mediaInfoFields, editableMediaInfoFields, mediaInfoField,
  hasAssets, findAsset, findThumbnail, findThumbnails
}
