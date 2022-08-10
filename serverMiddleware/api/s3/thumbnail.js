const util = require('../../util/file')
const u = require('../../user/userUtil')
const s3util = require('../../s3/s3util')

export default {
  path: '/api/s3/thumbnail',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return
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
        const thumbnailAsset = data.toString()
        s3util.headDestObject(thumbnailAsset).then((head) => {
          if (head && head.ContentLength && head.ContentLength > 0) {
            const Body = JSON.stringify(thumbnailAsset)
            const bucketParams = { Key, Body }
            s3util.destPut(bucketParams, `thumbnail: error writing selectedThumbnail: ${path}`)
            res.contentType = 'application/json'
            res.end(Body)
          } else {
            const message = `thumbnail: error in HEAD request for selected thumbnail asset: ${thumbnailAsset}`
            console.error(message)
            res.statusCode = 404
            res.end(message)
          }
        },
        (err) => {
          const message = `thumbnail: selected thumbnail asset not found: ${thumbnailAsset}: ${err}`
          console.error(message)
          res.statusCode = 404
          res.end(message)
        })
      })
    } else {
      res.statusCode = 400
      res.end('HTTP method must be GET or POST')
    }
  }
}
