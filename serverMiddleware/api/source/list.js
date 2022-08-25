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
              console.error(`error connecting to ${sc}: ${err}`)
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
        if (!obj.meta && obj.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
          obj.meta = await manifest.deriveMetadata(sourceApi[obj.source], obj.sourcePath)
        }
      }
      await redis.set(cacheKey, JSON.stringify(listing), LISTING_CACHE_EXPIRATION)
      return api.okJson(res, listing)
    } catch (e) {
      return api.handleSourceError(res, e)
    }
  }
}
