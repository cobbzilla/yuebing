const jp = require('jsonpath')

const FIELD_CANDIDATES = {
  videoTracks: ['$.media.track[?(@.@type=="General")].VideoCount'],
  audioTracks: ['$.media.track[?(@.@type=="General")].AudioCount'],
  format: ['$.media.track[?(@.@type=="General")].Format'],
  contentType: ['$.media.track[?(@.@type=="General")].InternetMediaType'],
  size: [
    '$.media.track[?(@.@type=="General")].FileSize_String4',
    '$.media.track[?(@.@type=="General")].FileSize_String3',
    '$.media.track[?(@.@type=="General")].FileSize_String2',
    '$.media.track[?(@.@type=="General")].FileSize_String1',
    '$.media.track[?(@.@type=="General")].FileSize_String',
    '$.media.track[?(@.@type=="General")].FileSize'
  ],
  duration: [
    '$.media.track[?(@.@type=="General")].Duration_String2',
    '$.media.track[?(@.@type=="General")].Duration_String2',
    '$.media.track[?(@.@type=="General")].Duration_String',
    '$.media.track[?(@.@type=="General")].Duration'
  ],
  bitRate: ['$.media.track[?(@.@type=="General")].OverallBitRate'],
  frameRate: ['$.media.track[?(@.@type=="General")].FrameRate'],
  dateEncoded: ['$.media.track[?(@.@type=="General")].File_Modified_Date'],
  width: ['$.media.track[?(@.@type=="Video")].Width'],
  height: ['$.media.track[?(@.@type=="Video")].Height'],

  // todo
  title: [],
  artist: [],
  album_artist: [],
  author: [],
  composer: [],
  year: [],
  copyright: [],
  album: [],
  description: [],
  comment: [],
  genre: [],
  location: [],
  show: [],
  episode: [],
  episode_sort: [],
  season: [],
  lyrics: []
}

function mediaInfoFields () {
  return Object.keys(FIELD_CANDIDATES)
}

function mediaInfoField (field, mediainfo) {
  const candidates = FIELD_CANDIDATES[field]
  if (candidates) {
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i]
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

export { mediaInfoFields, mediaInfoField }
