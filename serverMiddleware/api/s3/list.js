const m = require('../../../shared/media')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const s3util = require('../../s3/s3util')

export default {
  path: '/api/s3/list',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return
    }
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`>>>>> API: Listing ${req.url}, prefix=${prefix}`)
    res.contentType = 'application/json'

    const results = await s3util.listSource(prefix)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.mediaType && result.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
        result.meta = await manifest.deriveMetadata(result.name)
      }
    }
    res.end(JSON.stringify(results))
  }
}
