const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const c = require('../../../shared')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')

export default {
  path: '/api/source/thumbnail',
  async handler (req, res) {
    const user = await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const pth = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const thumbPath = system.assetsDir(pth) + c.SELECTED_THUMBNAIL_FILE
    if (req.method === 'GET') {
      res.statusCode = 200
      res.contentType = 'application/json'
      await system.api.read(thumbPath, chunk => res.write(chunk), () => res.end())
    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        const thumbnailAsset = JSON.parse(data.toString())
        system.api.metadata(thumbnailAsset).then(async (head) => {
          if (head && head.size && head.size > 0) {
            const thumbJson = JSON.stringify(thumbnailAsset)
            await system.api.writeFile(thumbPath, thumbJson)
            // flush metadata so manifest.deriveMetadata will see new selectedThumbnail
            manifest.flushCachedMetadata(pth).then(() => {
              logger.info('thumbnail: flushCachedMetadata finished')
            })
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
