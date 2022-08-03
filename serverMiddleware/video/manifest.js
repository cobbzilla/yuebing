const path = require('path')
const shasum = require('shasum')
const redis = require('../redis')
const nuxt = require('../../nuxt.config')
const s3util = require('../s3/s3util')
const util = require('../util')

const MIN_CACHE_PERIOD = 5 * 60 * 1000 // 5 minutes

async function deriveMetadata (sourcePath) {
  // currently only video is supported
  if (!util.isVideo(sourcePath)) {
    return {}
  }

  // Do we have this cached?
  const cacheKey = 'CACHED_META_' + shasum(sourcePath)
  const cachedMeta = JSON.parse(await redis.get(cacheKey))
  if (cachedMeta && cachedMeta.ctime) {
    // if the cache ctime is within a short period, don't even bother checking the destination
    if (Date.now() - cachedMeta.ctime < MIN_CACHE_PERIOD) {
      console.log('deriveMetadata cache is young, returning it: ' + JSON.stringify(cachedMeta))
      return cachedMeta
    }
    // check last-modified time on directory
    const lastModified = await s3util.headDestObject(util.canonicalDestDir(sourcePath) + util.LAST_MODIFIED_FILE)
    if (lastModified && lastModified.LastModified) {
      const destModified = Date.parse(lastModified.LastModified)
      if (destModified > cachedMeta.ctime) {
        console.log(`deriveMetadata: destination modified after cache created, recreating for source: ${sourcePath}`)
      } else {
        // the cache is valid!
        return cachedMeta
      }
    } else {
      console.log('deriveMetadata recalculating because lastModified file does not exist or is newer than cache for sourcePath: ' + sourcePath)
    }
  } else {
    console.log('deriveMetadata no data in cache, recalculating for: ' + sourcePath)
  }

  const videoConfig = nuxt.default.privateRuntimeConfig.transform.video
  const profiles = videoConfig.profiles
  const thumbnails = videoConfig.thumbnails
  const meta = {
    ctime: Date.now(),
    videos: {},
    thumbnails: {},
    status: {}
  }

  // list all transcodes
  const prefix = util.canonicalDestDir(sourcePath) + util.XFORM_TRANSCODE_PREFIX
  const transcodes = await s3util.listDest(prefix)
  console.log(`>>>>>>>>>>>>>>. found transcodes: ${JSON.stringify(transcodes)} under prefix ${prefix}`)
  transcodes.forEach((t) => {
    const base = path.basename(t.name)
    const underscore = base.indexOf('_')
    const dot = base.indexOf('.')
    if (underscore !== -1 && dot !== -1 && dot > underscore) {
      const foundProfile = base.substring(underscore + 1, dot)
      meta.videos[foundProfile] = t.name
    }
  })

  let allTranscodesDone = true
  let someTranscodesDone = false
  for (const name in profiles) {
    if (!(name in meta.videos)) {
      allTranscodesDone = false
      if (someTranscodesDone) {
        break
      }
    } else {
      someTranscodesDone = true
    }
  }

  // list all thumbnails
  const thumbs = await s3util.listDest(util.canonicalDestDir(sourcePath) + util.XFORM_THUMBNAIL_PREFIX)
  thumbs.forEach((t) => {
    const base = path.basename(t.name)
    const underscore = base.indexOf('_')
    const nextUnderscore = (underscore === -1 || underscore === base.length)
      ? -1
      : base.indexOf('_', underscore + 1)
    const dot = base.indexOf('.')
    if (underscore !== -1 && nextUnderscore !== -1 && dot !== -1 && dot > nextUnderscore) {
      const foundProfile = base.substring(underscore + 1, nextUnderscore)
      if (!(foundProfile in meta.thumbnails)) {
        meta.thumbnails[foundProfile] = []
      }
      meta.thumbnails[foundProfile].push(t.name)
    }
  })

  let allThumbnailsDone = true
  for (const name in thumbnails) {
    if (!(name in meta.thumbnails)) {
      allThumbnailsDone = false
      break
    }
  }
  if (allTranscodesDone && allThumbnailsDone) {
    meta.status.complete = true
  }
  if (someTranscodesDone) {
    meta.status.ready = true
  }

  await redis.set(cacheKey, JSON.stringify(meta))
  console.log('deriveMetadata returning: ' + JSON.stringify(meta))
  return meta
}

export { deriveMetadata }
