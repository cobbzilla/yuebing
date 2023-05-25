const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const cache = require('../../util/cache')
const { currentUser, isAdminOrVerified } = require('../../user/userUtil')

export default {
  path: '/api/source/thumbnail',
  async handler (req, res) {
    const user = await currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.forbidden(res)
    }
    if (!user && req.method !== 'GET') {
      return api.forbidden(res)
    }
    const pth = req.url.startsWith('/') ? req.url.substring(1) : req.url
    if (req.method === 'GET') {
      const thumb = await cache.findSelectedThumbnail(pth)
      return thumb ? api.okJson(res, thumb) : api.notFound(res, pth)

    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        const thumbJson = data.toString()
        const thumbnailAsset = JSON.parse(thumbJson)
        // ensure the asset exists before setting it
        system.storage.metadata(thumbnailAsset).then(async (head) => {
          if (head && head.size && head.size > 0) {
            await cache.setSelectedThumbnail(pth, thumbnailAsset)
            return api.okJson(res, thumbJson)

          } else {
            const message = `thumbnail: error in HEAD request for selected thumbnail asset: ${thumbnailAsset}`
            logger.error(message)
            return api.notFound(res, message)
          }
        },
        (err) => {
          const message = `thumbnail: selected thumbnail asset not found: ${thumbnailAsset}: ${err}`
          logger.error(message)
          return api.notFound(res, message)
        })
      })
    } else {
      api.badRequest(res, 'HTTP method must be GET or POST')
    }
  }
}
