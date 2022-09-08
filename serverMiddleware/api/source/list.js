const { basename } = require('path')
const { NO_CACHE_HEADER } = require('../../../shared')
const { UNKNOWN_MEDIA_TYPE, mediaType, hasMediaInfo, hasProfiles } = require('../../../shared/media')
const { extractSourceAndPath } = require('../../../shared/source')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const cache = require('../../util/cache')
const redis = require('../../util/redis')
const u = require('../../user/userUtil')
const src = require('../../source/sourceUtil')
const { currentUser } = require('../../user/userUtil')
const { search } = require('../../asset/search')
const logger = system.logger

const LISTING_CACHE_EXPIRATION = system.privateConfig.redis.listingCacheExpiration

const listObjects = async (req, res) => {
  const user = await u.requireUser(req, res)
  if (!user) {
    return api.forbidden(res)
  }
  const noCache = req.headers && req.headers[NO_CACHE_HEADER]
  const cacheKey = src.objectListCacheKey(req)
  const results = noCache ? null : await redis.get(cacheKey)
  if (results) {
    const obj = JSON.parse(results)
    return Array.isArray(obj)
      ? api.okJson(res, obj)
      : api.handleSourceError(res, obj)
  }
  try {
    const sourceAndPath = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const { source, pth } = await src.extractSourceAndPathAndConnect(sourceAndPath)
    const listing = await source.list(pth || '')
    const promises = listing.map(async file => new Promise(async (resolve) => {
      file.sourcePath = source.name + '/' + file.name
      if (!hasProfiles(file)) {
        resolve()
      }
      cache.getCachedMetadata(source.name + '/' + file.name)
        .then(meta => file.meta = meta)
        .then(resolve)
    }))
    await Promise.all(promises)
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
      if (!user && !system.isPublic()) {
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
