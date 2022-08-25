const path = require('path')
const c = require('../../shared')
const m = require('../../shared/media')
const redis = require('../util/redis')
const util = require('../util/file')
const system = require('../util/config').SYSTEM

const MANIFEST_CACHE_EXPIRATION = system.privateConfig.redis.manifestCacheExpiration

async function flushCachedMetadata (sourcePath) {
  const cacheKey = util.redisMetaCacheKey(sourcePath)
  return await redis.del(cacheKey)
}

async function deriveMetadata (source, sourcePath) {
  // Do we have this cached?
  const cacheKey = util.redisMetaCacheKey(source.name + ':' + sourcePath)
  const cachedMeta = JSON.parse(await redis.get(cacheKey))
  if (cachedMeta && cachedMeta.ctime) {
    // if the cache ctime is within a short period, don't even bother checking the destination
    if (Date.now() - cachedMeta.ctime < MANIFEST_CACHE_EXPIRATION) {
      // console.log(`deriveMetadata cache is young, returning it: ${JSON.stringify(cachedMeta)}`)
      return cachedMeta
    }
    // check last-modified time on directory
    const lastModified = await source.safeMetadata(system.canonicalDestDir(source.name + ':' + sourcePath) + c.LAST_MODIFIED_FILE)
    if (lastModified && lastModified.mtime) {
      const destModified = new Date(lastModified.mtime)
      if (destModified > cachedMeta.ctime) {
        console.log(`deriveMetadata: destination modified after cache created, recreating for source: ${sourcePath}`)
      } else {
        // the cache is valid!
        return cachedMeta
      }
    } else {
      console.log(`deriveMetadata recalculating because lastModified file does not exist or is newer than cache for sourcePath: ${sourcePath}`)
    }
  } else {
    console.log(`deriveMetadata no data in cache, recalculating for: ${sourcePath}`)
  }

  const meta = {
    ctime: Date.now(),
    assets: {},
    status: {}
  }

  const profiles = m.mediaProfilesForSource(sourcePath)
  if (profiles === null) {
    console.log(`no media profiles exist for path: ${sourcePath} (returning basic meta)`)
    return meta
  }

  // find all assets
  const prefix = system.canonicalDestDir(sourcePath)
  const assets = await system.api.find(prefix, m.ASSET_PREFIX)
  assets.forEach((asset) => {
    // console.log(`examining asset: ${asset}`)
    const base = path.basename(asset.name)
    const underscore = base.indexOf('_')
    const dot = base.indexOf('.')
    const at = base.indexOf('@')
    if (underscore !== -1 && dot !== -1 && dot > underscore) {
      const foundProfile = (at !== -1 && at > underscore && at < dot)
        ? base.substring(underscore + 1, at)
        : base.substring(underscore + 1, dot)
      // console.log(`deriveMetadata: examining foundProfile ${foundProfile} from base ${base}`)
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
            meta.assets[foundProfile].push(asset.name)
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
  }
  if (primaryAssetsDone) {
    meta.status.ready = true
  }

  // is there a selected thumbnail?
  try {
    const selectedThumbnail = await system.api.readFile(system.canonicalDestDir(sourcePath) + c.SELECTED_THUMBNAIL_FILE)
    meta.selectedThumbnail = JSON.parse(selectedThumbnail)
  } catch (err) {
    console.log(`deriveMetadata: error finding/parsing selected thumbnail: ${err}`)
  }

  await redis.set(cacheKey, JSON.stringify(meta))
  // console.log('deriveMetadata returning: ' + JSON.stringify(meta))
  return meta
}

export { deriveMetadata, flushCachedMetadata }
