const util = require('../../util/file')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/thumbnail',
  async handler (req, res) {
    const user = await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const url = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url
    const p = url === '/undefined' ? '' : url.startsWith('/') ? url.substring(1) : req.url
    const { source, path } = src.extractSourceAndPathAndConnect(p)
    const thumbPath = u.canonicalDestDir(path) + util.SELECTED_THUMBNAIL_FILE
    if (req.method === 'GET') {
      res.statusCode = 200
      await source.readFile(thumbPath, chunk => res.write(chunk))
      res.end()
    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        const thumbnailAsset = JSON.parse(data.toString())
        source.metadata(thumbnailAsset).then((head) => {
          if (head && head.size && head.size > 0) {
            const thumbJson = JSON.stringify(thumbnailAsset)
            source.writeFile(thumbPath, thumbJson)
            api.okJson(res, thumbJson)
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
