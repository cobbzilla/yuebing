const shasum = require('shasum')
const redis = require('./redis')
const c = require('../../shared')
const { extractSourceAndPathAndConnect } = require('../source/sourceUtil')
const system = require('./config').SYSTEM
const logger = system.logger

const MANIFEST_CACHE_EXPIRATION = system.privateConfig.redis.manifestCacheExpiration

const REDIS_META_PREFIX = 'CACHED_META_'
const REDIS_SELECTED_THUMBNAIL_PREFIX = 'CACHED_SELECTED_THUMBNAIL_'

const cacheKey = (prefix, sourceAndPath) => prefix + shasum(sourceAndPath)

const redisMetaCacheKey = sourceAndPath => cacheKey(REDIS_META_PREFIX, sourceAndPath)
const redisSelectedThumbnailCacheKey = sourceAndPath => cacheKey(REDIS_SELECTED_THUMBNAIL_PREFIX, sourceAndPath)

const cachedMetaPath = sourceAndPath => system.assetsDir(sourceAndPath) + 'cached_meta.json'

const getCachedMetadata = async (sourceAndPath) => {
  const logPrefix = `getCachedMetadata(${sourceAndPath})`
  const debug = (msg) => logger.debug(`${logPrefix} ${msg}`)

  let cachedMeta = await redis.getJson(redisMetaCacheKey(sourceAndPath))
  let fromFile = false
  if (!cachedMeta) {
    const metaPath = cachedMetaPath(sourceAndPath)
    debug(`no cachedMeta in redis, looking for metaPath=${metaPath}`)
    const metaPathData = await system.api.safeReadFile(metaPath)
    if (metaPathData) {
      cachedMeta = JSON.parse(metaPathData)
      debug(`found metaPath=${metaPath} --> ${metaPathData}`)
      await setCachedMetadata(sourceAndPath, cachedMeta)
      fromFile = true
    } else {
      debug(`metaPath=${metaPath} --> NOT FOUND`)
    }
  }
  const now = Date.now()
  if (cachedMeta && (cachedMeta.ctime || cachedMeta.finished)) {
    if (cachedMeta.finished) {
      debug(`we have cachedMeta=${JSON.stringify(cachedMeta)} that claims to be final, caching and returning it`)
      await setMetadataFinished(sourceAndPath)
      if (!fromFile) {
        await writeMetadataFile(sourceAndPath, cachedMeta)
      }
      return cachedMeta
    }
    // if the cache ctime is within a short period, don't even bother checking the destination
    if (now - cachedMeta.ctime < MANIFEST_CACHE_EXPIRATION) {
      debug(`cache is young enough, returning it: ${JSON.stringify(cachedMeta)}`)
      if (!fromFile) {
        await writeMetadataFile(sourceAndPath, cachedMeta)
      }
      return cachedMeta
    }
    // check last-modified time on directory
    const lastModified = await system.api.safeMetadata(system.assetsDir(sourceAndPath) + c.LAST_MODIFIED_FILE)
    if (lastModified && lastModified.mtime) {
      const destModified = new Date(lastModified.mtime)
      if (destModified > cachedMeta.ctime) {
        debug(`destination modified after cache created, recreating for source: ${sourceAndPath}`)
      } else {
        // the cache is valid!
        debug(`cached created after last destination mod, returning cachedMeta: ${JSON.stringify(cachedMeta)}`)
        if (!fromFile) {
          await writeMetadataFile(sourceAndPath, cachedMeta)
        }
        return cachedMeta
      }
    } else {
      debug(`recalculating because lastModified file does not exist or is newer than cache for sourceAndPath: ${sourceAndPath}`)
    }
  } else {
    debug(`no data in cache for: ${sourceAndPath}`)
  }
  return null
}

const writeMetadataFile = async (sourceAndPath, meta) =>
  await system.api.writeFile(cachedMetaPath(sourceAndPath), JSON.stringify(meta))

const getCachedSelectedThumbnail = async (sourceAndPath) => await redis.getJson(redisSelectedThumbnailCacheKey(sourceAndPath))

const setCachedMetadata = async (sourceAndPath, meta) => await redis.set(redisMetaCacheKey(sourceAndPath), JSON.stringify(meta))
const setCachedSelectedThumbnail = async (sourceAndPath, thumb) => await redis.set(redisSelectedThumbnailCacheKey(sourceAndPath), JSON.stringify(thumb))

const flushMetadata = async sourceAndPath => await redis.del(redisMetaCacheKey(sourceAndPath))
const flushSelectedThumbnail = async sourceAndPath => await redis.del(redisSelectedThumbnailCacheKey(sourceAndPath))

const hardFlushCachedMetadata = async (sourceAndPath) => {
  await flushMetadata(sourceAndPath)
  await system.api.remove(cachedMetaPath(sourceAndPath))
}

const hardSetCachedMetadata = async (sourceAndPath, meta) => {
  await writeMetadataFile(sourceAndPath, meta)
  await setCachedMetadata(sourceAndPath, meta)
}

const FINISHED_MANIFEST_CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 90 // 90 days, it's finished after all
const setMetadataFinished = async (sourceAndPath) => await redis.expire(redisMetaCacheKey(sourceAndPath), FINISHED_MANIFEST_CACHE_EXPIRATION)

const thumbFile = (sourceAndPath) => system.assetsDir(sourceAndPath) + c.SELECTED_THUMBNAIL_FILE

const findSelectedThumbnail = async (sourceAndPath) => {
  const logPrefix = `findSelectedThumbnail(${sourceAndPath}):`
  let thumb = await getCachedSelectedThumbnail(sourceAndPath)
  if (!thumb) {
    const thumbJson = await system.api.safeReadFile(thumbFile(sourceAndPath))
    if (thumbJson) {
      thumb = JSON.parse(thumbJson)
      await setCachedSelectedThumbnail(sourceAndPath, thumb)
    } else {
      logger.debug(`${logPrefix} no selected thumbnail for ${sourceAndPath}`)
      thumb = null
    }
  }
  return thumb
}

const setSelectedThumbnail = async (sourceAndPath, thumb) => {
  const bytesWritten = await system.api.writeFile(thumbFile(sourceAndPath), JSON.stringify(thumb))
  if (bytesWritten) {
    await setCachedSelectedThumbnail(sourceAndPath, thumb)
  }
  return bytesWritten
}

module.exports = {
  getCachedMetadata, setCachedMetadata,
  flushMetadata, hardFlushCachedMetadata, hardSetCachedMetadata, setMetadataFinished,
  getCachedSelectedThumbnail, setCachedSelectedThumbnail, flushSelectedThumbnail,
  findSelectedThumbnail, setSelectedThumbnail
}
