const { basename } = require('path')
const { NO_CACHE_HEADER } = require('../../../shared')
const { UNKNOWN_MEDIA_TYPE, mediaType, hasMediaInfo } = require('../../../shared/media')
const { extractSourceAndPath } = require('../../../shared/source')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const redis = require('../../util/redis')
const u = require('../../user/userUtil')
const { deriveMetadata, deriveMediaInfo } = require('../../asset/manifest')
const src = require('../../source/sourceUtil')
const { currentUser } = require('../../user/userUtil')
const { search } = require('../../asset/search')
const { getTagsForPath } = require('../../asset/content')
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
    const path = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const { sourceName, pth } = extractSourceAndPath(path)
    const sourceObjects = await src.listSourcesWithoutSelf({ pageSize: 1000 })
    const singleSource = sourceObjects.list.find(s => s.name === sourceName)
    const sourceNames = singleSource ? [sourceName] : [...sourceObjects.list.map(src => src.name)]
    const searchPath = singleSource ? pth : path
    const promises = {}
    const sourceApi = {}
    for (const sc of sourceNames) {
      promises[sc] = src.connect(sc)
        .then(
          (api) => {
            sourceApi[sc] = api
            return api.list(searchPath)
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
          obj.basename = basename(obj.name)
          obj.path = sc + '/' + obj.name
          obj.mediaType = mediaType(obj.name)
          obj.processed = true
        }
        return obj
      }))
    }
    for (const obj of listing) {
      if (obj.mediaType !== UNKNOWN_MEDIA_TYPE) {
        if (!obj.meta) {
          obj.meta = await deriveMetadata(sourceApi[obj.source], obj.sourcePath)
        }
        if (!obj.mediainfo && hasMediaInfo(obj) && obj.meta) {
          obj.mediainfo = await deriveMediaInfo(obj.meta, `${obj.source}/${obj.sourcePath}`)
        }
        if (!obj.tags) {
          obj.tags = await getTagsForPath(obj.sourcePath)
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
