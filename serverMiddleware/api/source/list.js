const path = require('path')
const m = require('../../../shared/media')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const redis = require('../../util/redis')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const s = require('../../../shared/source')
const src = require('../../source/sourceUtil')

const LISTING_CACHE_EXPIRATION = system.privateConfig.redis.listingCacheExpiration

export default {
  path: '/api/source/list',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const cacheKey = `listCache_${req.url}`
    const results = await redis.get(cacheKey)
    if (results) {
      return results
    }
    try {
      const { sourceName, pth } = s.extractSourceAndPath(req.url)
      if (!sourceName) { return api.okJson(res, []) }
      const sources = []
      if (sourceName === '@') {
        const sourceObjects = await src.listSourcesWithoutSelf({ pageSize: 1000 })
        sources.push(...sourceObjects.list.map(src => src.name))
      } else {
        sources.push(sourceName)
      }
      const promises = {}
      for (const sc of sources) {
        promises[sc] = src.connect(sc).then(api => api.list(pth))
      }
      const results = []
      for (const sc of Object.keys(promises)) {
        const objects = await promises[sc]
        results.push(...objects.map((obj) => {
          obj.path = sc + '/' + obj.name
          obj.name = path.basename(obj.name)
          obj.mediaType = m.mediaType(obj.name)
          return obj
        }))
      }
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result.mediaType && result.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
          result.meta = await manifest.deriveMetadata(sourceName, result.name)
        }
      }
      await redis.set(cacheKey, results, LISTING_CACHE_EXPIRATION)
      return api.okJson(res, results)
    } catch (e) {
      return api.serverError(res, 'error listing')
    }
  }
}
