const path = require('path')
const m = require('../../../shared/media')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const redis = require('../../util/redis')
const u = require('../../user/userUtil')
const { deriveMetadata, deriveMediaInfo } = require('../../asset/manifest')
const src = require('../../source/sourceUtil')
const { currentUser } = require('../../user/userUtil')
const { search } = require('../../asset/search')
const logger = system.logger

const LISTING_CACHE_EXPIRATION = system.privateConfig.redis.listingCacheExpiration
const isPublic = () => system.publicConfig.public

const listObjects = async (req, res) => {
  const user = await u.requireUser(req, res)
  if (!user) {
    return api.forbidden(res)
  }
  const cacheKey = src.objectListCacheKey(req)
  const results = await redis.get(cacheKey)
  if (results) {
    const obj = JSON.parse(results)
    return Array.isArray(obj)
      ? api.okJson(res, obj)
      : api.handleSourceError(res, obj)
  }
  try {
    const pth = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const sourceObjects = await src.listSourcesWithoutSelf({ pageSize: 1000 })
    const sourceNames = [...sourceObjects.list.map(src => src.name)]
    const promises = {}
    const sourceApi = {}
    for (const sc of sourceNames) {
      promises[sc] = src.connect(sc)
        .then(
          (api) => {
            sourceApi[sc] = api
            return api.list(pth)
          },
          (err) => {
            logger.error(`error connecting to ${sc}: ${err}`)
            throw err
          })
    }
    const listing = []
    for (const sc of Object.keys(promises)) {
      const objects = await promises[sc]
      listing.push(...objects.map((obj) => {
        if (!obj.processed) {
          obj.source = sc
          obj.sourcePath = obj.name
          obj.basename = path.basename(obj.name)
          obj.path = sc + '/' + obj.name
          obj.mediaType = m.mediaType(obj.name)
          obj.processed = true
        }
        return obj
      }))
    }
    for (const obj of listing) {
      if (obj.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
        if (!obj.meta) {
          obj.meta = await deriveMetadata(sourceApi[obj.source], obj.sourcePath)
        }
        if (!obj.mediainfo && m.hasMediaInfo(obj) && obj.meta) {
          obj.mediainfo = await deriveMediaInfo(obj.meta, `${obj.source}/${obj.sourcePath}`)
        }
      }
    }
    await redis.set(cacheKey, JSON.stringify(listing), LISTING_CACHE_EXPIRATION)
    return api.okJson(res, listing)
  } catch (e) {
    return api.handleSourceError(res, e)
  }
}

export default {
  path: '/api/source/list',
  async handler (req, res) {
    if (req.method === 'GET') {
      return await listObjects(req, res)
    } else if (req.method === 'POST') {
      const user = await currentUser(req)
      if (!user && !isPublic()) {
        return api.forbidden(res)
      }
      req.on('data', async (data) => {
        const query = JSON.parse(data)
        try {
          const results = await search(user, query)
          return api.okJson(res, results)
        } catch (e) {
          logger.error(`/api/sources/list: error searching: ${e}`)
          return api.okJson(res, [])
        }
      })
    } else {
      return api.notFound(res)
    }
  }
}
