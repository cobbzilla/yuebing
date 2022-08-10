const jp = require('jsonpath')

const META_FIELDS = {
  videoTracks: { find: ['$.media.track[?(@.@type=="General")].VideoCount'] },
  audioTracks: { find: ['$.media.track[?(@.@type=="General")].AudioCount'] },
  format: { find: ['$.media.track[?(@.@type=="General")].Format'] },
  contentType: { find: ['$.media.track[?(@.@type=="General")].InternetMediaType'] },
  size: {
    find: [
      '$.media.track[?(@.@type=="General")].FileSize_String4',
      '$.media.track[?(@.@type=="General")].FileSize_String3',
      '$.media.track[?(@.@type=="General")].FileSize_String2',
      '$.media.track[?(@.@type=="General")].FileSize_String1',
      '$.media.track[?(@.@type=="General")].FileSize_String',
      '$.media.track[?(@.@type=="General")].FileSize'
    ]
  },
  duration: {
    find: [
      '$.media.track[?(@.@type=="General")].Duration_String2',
      '$.media.track[?(@.@type=="General")].Duration_String2',
      '$.media.track[?(@.@type=="General")].Duration_String',
      '$.media.track[?(@.@type=="General")].Duration'
    ]
  },
  bitRate: { find: ['$.media.track[?(@.@type=="General")].OverallBitRate'] },
  frameRate: { find: ['$.media.track[?(@.@type=="General")].FrameRate'] },
  dateEncoded: { find: ['$.media.track[?(@.@type=="General")].File_Modified_Date'] },
  width: { find: ['$.media.track[?(@.@type=="Video")].Width'] },
  height: { find: ['$.media.track[?(@.@type=="Video")].Height'] },

  // todo -- some of the less common ones are probably not correct and/or may require more JSONPaths in the find array
  title: { editable: true, find: ['$.media.track[?(@.@type=="General")].Title'] },
  artist: { editable: true, find: ['$.media.track[?(@.@type=="General")].Artist'] },
  album_artist: { editable: true, find: ['$.media.track[?(@.@type=="General")].Album_Artist'] },
  author: { editable: true, find: ['$.media.track[?(@.@type=="General")].Author'] },
  composer: { editable: true, find: ['$.media.track[?(@.@type=="General")].Composer'] },
  year: { editable: true, find: ['$.media.track[?(@.@type=="General")].Year'] },
  copyright: { editable: true, find: ['$.media.track[?(@.@type=="General")].Copyright'] },
  album: { editable: true, find: ['$.media.track[?(@.@type=="General")].Album'] },
  movie: { editable: true, find: ['$.media.track[?(@.@type=="General")].Movie'] },
  description: { editable: true, find: ['$.media.track[?(@.@type=="General")].Description'] },
  comment: { editable: true, find: ['$.media.track[?(@.@type=="General")].Comment'] },
  genre: { editable: true, find: ['$.media.track[?(@.@type=="General")].Genre'] },
  location: { editable: true, find: ['$.media.track[?(@.@type=="General")].Location'] },
  show: { editable: true, find: ['$.media.track[?(@.@type=="General")].Show'] },
  episode: { editable: true, find: ['$.media.track[?(@.@type=="General")].Episode'] },
  episode_sort: { editable: true, find: ['$.media.track[?(@.@type=="General")].Episode_Sort'] },
  season: { editable: true, find: ['$.media.track[?(@.@type=="General")].Season'] },
  lyrics: { editable: true, find: ['$.media.track[?(@.@type=="General")].Lyrics'] }
}

function mediaInfoFields () {
  return Object.keys(META_FIELDS)
}

function mediaInfoField (field, mediainfo) {
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
    console.log(`mediaInfoField: field not found in mediainfo: ${field}`)
  }
  console.warn(`mediaInfoField: invalid field: ${field}`)
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

export { mediaInfoFields, mediaInfoField, hasAssets, findAsset }
