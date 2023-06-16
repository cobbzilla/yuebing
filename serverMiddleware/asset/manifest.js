const shasum = require('shasum')
const { basename } = require('path')
const { extractVolumeAndPath } = require('../../shared/model/volume')
const m = require('../../shared/media')
const cache = require('../util/cache')
const redis = require('../util/redis')
const system = require('../util/config').SYSTEM
const logger = system.logger

async function deriveMetadata (source, sourcePath) {
  const sourceAndPath = `${source.name}/${sourcePath}`
  return deriveMetadataFromSourceAndPath(sourceAndPath)
}

async function deriveMetadataFromSourceAndPath (sourceAndPath, opts = null) {
  const logPrefix = `deriveMetadata(${sourceAndPath}):`
  const debug = msg => logger.debug(`${logPrefix} ${msg}`)
  const silly = msg => logger.silly(`${logPrefix} ${msg}`)
  const noCache = opts && opts.noCache

  // Do we have this redis-cached?
  const cachedMeta = noCache ? null : await cache.getCachedMetadata(sourceAndPath)
  if (cachedMeta) {
    return cachedMeta
  }

  const meta = {
    ctime: Date.now(),
    assets: {},
    status: {}
  }

  debug(`METADATA RECALC BEGINS: finding profiles...`)
  const profiles = m.mediaProfilesForSource(sourceAndPath)
  if (profiles === null) {
    debug(`no media profiles exist for path: ${sourceAndPath} (returning basic meta)`)
    return meta
  }

  // find all assets
  const prefix = system.assetsDir(sourceAndPath)
  const start = Date.now()
  const assets = await system.storage.find(prefix, m.ASSET_PREFIX)
  const end = Date.now()
  debug(`(find assets took ${''+((end - start)/1000)+' seconds'}), now examining ${assets.length} assets over profiles ${Object.keys(profiles).toString()}`)
  assets.forEach((asset) => {
    silly(`examining asset: ${asset ? JSON.stringify(asset) : 'undefined/null'}`)
    const base = basename(asset.name)
    const underscore = base.indexOf('_')
    const dot = base.indexOf('.')
    const at = base.indexOf('@')
    if (underscore !== -1 && dot !== -1 && dot > underscore) {
      const foundProfile = (at !== -1 && at > underscore && at < dot)
        ? base.substring(underscore + 1, at)
        : base.substring(underscore + 1, dot)
      silly(`${logPrefix} examining foundProfile ${foundProfile} from base ${base}`)
      if (foundProfile in profiles) {
        const prof = profiles[foundProfile]
        if (prof.enabled) {
          if (prof.operation === m.OP_MEDIAINFO && prof.contentType === 'application/json') {
            meta.status.info = true
          }
          if (prof.multiFile) {
            if (!(foundProfile in meta.assets)) {
              meta.assets[foundProfile] = []
            }
            if (prof.manifestAssets && prof.manifestAssets.length > 0) {
              if (prof.manifestAssets.includes(base)) {
                meta.assets[foundProfile].push(asset.name)
              }
            } else {
              meta.assets[foundProfile].push(asset.name)
            }
          } else {
            meta.assets[foundProfile] = [asset.name]
          }
        }
      }
    }
  })

  // determine if everything is done, and if "enough" is done
  let allAssetsDone = true
  let primaryAssetsDone = false
  for (const name in profiles) {
    const profile = profiles[name]
    if (!profile.enabled) {
      continue
    }
    if (!(name in meta.assets)) {
      allAssetsDone = false
    } else if (profile.primary) {
      primaryAssetsDone = true
    }
  }

  if (allAssetsDone) {
    meta.status.complete = true
    meta.finished = true
  }
  if (primaryAssetsDone) {
    meta.status.ready = true
  }

  await cache.hardSetCachedMetadata(sourceAndPath, meta)
  debug(`deriveMetadata FINALLY returning: ${JSON.stringify(meta)}`)
  return meta
}

const MEDIAINFO_CACHE_PREFIX = 'mediainfo_'
const MEDIAINFO_CACHE_EXPIRATION = 1000 * 60 * 60 * 24 * 30
const NO_MEDIAINFO_VALUE = 'no_mediainfo'

const mediaInfoCacheKey = sourceAndPath => MEDIAINFO_CACHE_PREFIX + shasum(sourceAndPath)

const cache_enabled = true
const deriveMediaInfo = async (meta, sourceAndPath, opts = null) => {
  const cacheKey = mediaInfoCacheKey(sourceAndPath)
  const cached = (opts && opts.cache && opts.cache === false) || !cache_enabled ? null : await redis.get(cacheKey)
  if (cached) {
    return cached === NO_MEDIAINFO_VALUE ? null : JSON.parse(cached)
  }
  const { volume, pth } = extractVolumeAndPath(sourceAndPath)
  const info = await system.userMediaInfo(meta, volume, pth)
  await redis.set(cacheKey, info ? JSON.stringify(info) : NO_MEDIAINFO_VALUE, MEDIAINFO_CACHE_EXPIRATION)
  return info
}

const flushMediaInfoCache = sourceAndPath => redis.del(mediaInfoCacheKey(sourceAndPath))

export { deriveMetadata, deriveMetadataFromSourceAndPath, deriveMediaInfo, flushMediaInfoCache }
