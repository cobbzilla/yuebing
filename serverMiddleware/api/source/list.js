const { NO_CACHE_HEADER } = require('../../../shared')
const { hasProfiles } = require('../../../shared/media')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const cache = require('../../util/cache')
const redis = require('../../util/redis')
const u = require('../../user/userUtil')
const src = require('../../source/sourceUtil')
const { currentUser } = require('../../user/userUtil')
const { search } = require('../../asset/search')
const logger = system.logger

const listObjects = async (req, res) => {
  const user = await u.requireUser(req, res)
  if (!user) {
    return api.forbidden(res)
  }
  try {
    const sourceAndPath = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const { source, pth } = await src.extractSourceAndPathAndConnect(sourceAndPath)
    const listing = await source.list(pth || '')
    const promises = listing.map(async file => new Promise(async (resolve) => {
      file.sourcePath = source.name + '/' + file.name
      if (!hasProfiles(file.name)) {
        resolve()
      }
      cache.getCachedMetadata(source.name + '/' + file.name)
        .then((meta) => {
          if (meta) {
            logger.debug(`list(${sourceAndPath}) found cached meta, assigning meta for file ${file.name}=${JSON.stringify(meta)}`)
            file.meta = meta
          } else {
            logger.silly(`list(${sourceAndPath}) no cached meta found for file ${file.name}`)
          }
        })
        .then(() => {
          logger.info(`list(${sourceAndPath}) resolving for ${file.name}`)
          resolve()
        })
    }))
    await Promise.all(promises)
    logger.info(`list(${sourceAndPath}) all promises resolved, returning`)
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
          const { objectList, stillBuilding } = await search(user, query)
          return api.okJson(res, { objectList, stillBuilding })
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
