const manifest = require('../asset/manifest')
const c = require('../../shared/media')
const s3util = require('./s3util')

export default {
  path: '/s3/list',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log('>>>>> API: Listing ' + req.url + ', prefix = ' + prefix)
    const results = await s3util.listSource(prefix)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.mediaType && result.mediaType !== c.UNKNOWN_MEDIA_TYPE) {
        result.meta = await manifest.deriveMetadata(result.name)
      }
    }
    res.end(JSON.stringify(results, null, 2))
  }
}
