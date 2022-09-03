const path = require('path')
const m = require('../../shared/media')
const cache = require('../util/cache')
const system = require('../util/config').SYSTEM
const logger = system.logger

async function deriveMetadata (source, sourcePath) {
  const sourceAndPath = `${source.name}/${sourcePath}`
  return deriveMetadataFromSourceAndPath(sourceAndPath)
}

async function deriveMetadataFromSourceAndPath (sourceAndPath) {
  const logPrefix = `deriveMetadata(${sourceAndPath}):`
  const debug = (msg) => logger.debug(`${logPrefix} ${msg}`)
  const silly = (msg) => logger.silly(`${logPrefix} ${msg}`)

  // Do we have this redis-cached?
  const cachedMeta = cache.getCachedMetadata(sourceAndPath)
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
  const assets = await system.api.find(prefix, m.ASSET_PREFIX)
  debug(`examining ${assets.length} assets over profiles ${JSON.stringify(profiles.map(p => p.name))}`)
  assets.forEach((asset) => {
    silly(`examining asset: ${asset}`)
    const base = path.basename(asset.name)
    const underscore = base.indexOf('_')
    const dot = base.indexOf('.')
    const at = base.indexOf('@')
    if (underscore !== -1 && dot !== -1 && dot > underscore) {
      const foundProfile = (at !== -1 && at > underscore && at < dot)
        ? base.substring(underscore + 1, at)
        : base.substring(underscore + 1, dot)
      silly(`${logPrefix}: examining foundProfile ${foundProfile} from base ${base}`)
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
    meta.finished = true
  }
  if (primaryAssetsDone) {
    meta.status.ready = true
  }

  await cache.hardSetCachedMetadata(sourceAndPath, meta)
  debug(`deriveMetadata FINALLY returning: ${JSON.stringify(meta)}`)
  return meta
}

export { deriveMetadata, deriveMetadataFromSourceAndPath }
