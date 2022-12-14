const { hasProfiles } = require('../../../shared/media')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const cache = require('../../util/cache')
const src = require('../../source/sourceUtil')
const { currentUser, requireAdmin, isAdminOrVerified } = require('../../user/userUtil')
const { search } = require('../../asset/search')
const logger = system.logger

const listObjects = async (req, res) => {
  const user = await requireAdmin(req, res)
  if (!user) { return api.forbidden(res) }
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
      if (!isAdminOrVerified(user) && !system.isPublic()) {
        return api.forbidden(res)
      }
      req.on('data', async (data) => {
        const query = JSON.parse(data)
        if (query.s) {
          query.tags = query.s.split(/\s+/)
        }
        if (query.o) {
          query.offset = query.o
        }
        try {
          if (!query.tags || query.tags.length === 0 || query.tags.filter(w => w.trim().length > 0).length === 0) {
            return api.okJson(res, { objectList: [], total: 0, more: false })
          }
          return api.okJson(res, await search(user, query))
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
