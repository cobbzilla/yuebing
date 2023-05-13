const jp = require('jsonpath')
const c = require('../shared')
const { isThumbnailProfile, mediaProfileByName, mediaType } = require('./media')

const MEDIAINFO_FIELDS = {

  // fixme -- some of the less common ones are probably not correct and/or may require more JSONPaths in the find array
  // sort: 1xxx -- important/editable fields
  title: {
    sort: 1000,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Title'],
    major: true
  },
  artist: {
    sort: 1010,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Artist'],
    major: true
  },
  album_artist: {
    sort: 1020,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Album_Artist'],
    major: true
  },
  author: {
    sort: 1030,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Author'],
    major: true
  },
  composer: {
    sort: 1040,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Composer'],
    major: true
  },
  year: {
    sort: 1050,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Year'],
    major: true
  },
  copyright: {
    sort: 1060,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Copyright']
  },
  album: {
    sort: 1070,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Album'],
    major: true
  },
  movie: {
    sort: 1080,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Movie'],
    major: true
  },
  description: {
    sort: 1090,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Description'],
    major: true,
    disableWholeFieldIndex: true
  },
  comment: {
    sort: 1100,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Comment'],
    major: true,
    disableWholeFieldIndex: true
  },
  genre: {
    sort: 1110,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Genre'],
    major: true
  },
  location: {
    sort: 1120,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Location'],
    major: true
  },
  show: {
    sort: 1130,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Show'],
    major: true
  },
  episode: {
    sort: 1140,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Episode'],
    major: true
  },
  episode_sort: {
    sort: 1150,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Episode_Sort'],
    disableIndex: true
  },
  season: {
    sort: 1160,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Season'],
    major: true
  },
  lyrics: {
    sort: 1170,
    editable: true,
    find: ['$.media.track[?(@.@type=="General")].Lyrics']
  },
  tags: {
    sort: 1500,
    editable: true,
    major: true,
    find: ['$.media.track[?(@.@type=="General")].Tags'], // fixme: is this correct?
    array: true
  },

  // sort: 2xxx -- important read-only fields
  duration: {
    sort: 2000,
    find: [
      '$.media.track[?(@.@type=="General")].Duration_String2',
      '$.media.track[?(@.@type=="General")].Duration_String2',
      '$.media.track[?(@.@type=="General")].Duration_String',
      '$.media.track[?(@.@type=="General")].Duration'
    ],
    disableIndex: true,
    major: true
  },
  width: {
    sort: 2010,
    find: ['$.media.track[?(@.@type=="Video")].Width'],
    disableIndex: true
  },
  height: {
    sort: 2020,
    find: ['$.media.track[?(@.@type=="Video")].Height'],
    disableIndex: true
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
    ],
    disableIndex: true
  },
  videoLanguage: {
    sort: 2040,
    find: ['$.media.track[?(@.@type=="Video")].Language'],
    disableIndex: true
  },
  audioLanguage: {
    sort: 2050,
    find: ['$.media.track[?(@.@type=="Audio")].Language'],
    disableIndex: true
  },
  textTrackLanguages: {
    sort: 2060,
    find: ['$.media.track[?(@.@type=="Text")].Language'],
    disableIndex: true,
    array: true
  },

  // sort: 3xxx -- less well-known fields
  videoTrackCount: {
    sort: 3000,
    find: ['$.media.track[?(@.@type=="General")].VideoCount'],
    disableIndex: true
  },
  audioTrackCount: {
    sort: 3010,
    find: ['$.media.track[?(@.@type=="General")].AudioCount'],
    disableIndex: true
  },
  textTrackCount: {
    sort: 3020,
    find: ['$.media.track[?(@.@type=="Text")].TextCount'],
    disableIndex: true
  },
  format: {
    sort: 3030,
    find: ['$.media.track[?(@.@type=="General")].Format']
  },
  contentType: {
    sort: 3040,
    find: ['$.media.track[?(@.@type=="General")].InternetMediaType']
  },
  bitRate: {
    sort: 3050,
    find: ['$.media.track[?(@.@type=="General")].OverallBitRate'],
    disableIndex: true
  },
  frameRate: {
    sort: 3060,
    find: ['$.media.track[?(@.@type=="General")].FrameRate'],
    disableIndex: true
  },
  dateEncoded: {
    sort: 3070,
    find: ['$.media.track[?(@.@type=="General")].File_Modified_Date'],
    disableIndex: true,
    major: true
  }
}

const sortInfoFields = (f1, f2) => MEDIAINFO_FIELDS[f1].sort - MEDIAINFO_FIELDS[f2].sort

let _mediaInfoFields = null
function mediaInfoFields () {
  if (_mediaInfoFields === null) {
    _mediaInfoFields = Object.keys(MEDIAINFO_FIELDS).sort(sortInfoFields)
  }
  return _mediaInfoFields
}

let _majorFields = null
function majorMediaInfoFields () {
  if (_majorFields === null) {
    _majorFields = Object.keys(MEDIAINFO_FIELDS).filter(f => MEDIAINFO_FIELDS[f].major)
  }
  return _majorFields
}

let _minorFields = null
function minorMediaInfoFields () {
  if (_minorFields === null) {
    _minorFields = Object.keys(MEDIAINFO_FIELDS).filter(f => typeof MEDIAINFO_FIELDS[f].major === 'undefined' || !MEDIAINFO_FIELDS[f].major)
  }
  return _minorFields
}

let _editableMediaInfoFields = null
function editableMediaInfoFields () {
  if (_editableMediaInfoFields === null) {
    _editableMediaInfoFields = Object.keys(MEDIAINFO_FIELDS).filter(k => MEDIAINFO_FIELDS[k].editable).sort(sortInfoFields)
  }
  return _editableMediaInfoFields
}

function mediaInfoField (field, mediainfo, userMediainfo) {
  if (userMediainfo && userMediainfo[field]) {
    return userMediainfo[field]
  }
  const candidates = MEDIAINFO_FIELDS[field]
  if (candidates && candidates.find) {
    for (let i = 0; i < candidates.find.length; i++) {
      const candidate = candidates.find[i]
      const maxFind = 'array' in candidates && candidates.array === true ? 1000 : 1
      const found = jp.query(mediainfo, candidate, maxFind)
      if (found && found.length && found.length > 0) {
        const value = maxFind === 1 ? found[0] : JSON.stringify(found)
        return typeof value === 'string' ? value : JSON.stringify(value)
      }
    }
  }
  return null
}

function hasAssets (obj) {
  return obj && obj.meta &&
  obj.meta.status &&
  obj.meta.status.ready &&
  !c.empty(obj.meta.assets)
}

function hasProfileAssets (obj, profile) {
  return obj.meta &&
    obj.meta.status &&
    obj.meta.status.ready &&
    !c.empty(obj.meta.assets) &&
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
  if (!obj || !obj.meta || !(typeof obj.meta.assets === 'object') || c.empty(obj.meta.assets)) {
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
      thumb = findAsset(obj, (assets, profile) => isThumbnail(obj.path, profile))
    }
  }
  return thumb
}

function findThumbnails (obj) {
  if (hasAssets(obj)) {
    const thumbs = []
    Object.keys(obj.meta.assets)
      .filter(profile => isThumbnail(obj.path, profile))
      .forEach(profile => thumbs.push(...obj.meta.assets[profile]))
    return thumbs
  }
  return []
}

export {
  MEDIAINFO_FIELDS,
  mediaInfoFields, majorMediaInfoFields, minorMediaInfoFields,
  editableMediaInfoFields, mediaInfoField,
  hasAssets, findAsset, findThumbnail, findThumbnails
}
