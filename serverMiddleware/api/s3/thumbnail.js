const util = require('../../util/file')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const s3util = require('../../s3/s3util')
const manifest = require('../../asset/manifest')

export default {
  path: '/api/s3/thumbnail',
  async handler (req, res) {
    const user = await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const url = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url
    const path = url === '/undefined' ? '' : url.startsWith('/') ? url.substring(1) : req.url
    const Key = util.canonicalDestDir(path) + util.SELECTED_THUMBNAIL_FILE
    if (req.method === 'GET') {
      res.statusCode = 200
      await s3util.streamDestObject(Key, res)
      res.end()
    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        const thumbnailAsset = JSON.parse(data.toString())
        s3util.headDestObject(thumbnailAsset).then((head) => {
          if (head && head.ContentLength && head.ContentLength > 0) {
            const Body = JSON.stringify(thumbnailAsset)
            const bucketParams = { Key, Body }
            s3util.destPut(bucketParams, `thumbnail: error writing selectedThumbnail: ${path}`)
            api.okJson(Body)
            // flush metadata so manifest.deriveMetadata will see new selectedThumbnail
            manifest.flushCachedMetadata(path)
          } else {
            const message = `thumbnail: error in HEAD request for selected thumbnail asset: ${thumbnailAsset}`
            console.error(message)
            api.notFound(res, message)
          }
        },
        (err) => {
          const message = `thumbnail: selected thumbnail asset not found: ${thumbnailAsset}: ${err}`
          console.error(message)
          api.notFound(res, message)
        })
      })
    } else {
      api.badRequest(res, 'HTTP method must be GET or POST')
    }
  }
}
