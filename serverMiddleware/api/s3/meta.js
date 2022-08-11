const api = require('../../util/api')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')

export default {
  path: '/api/s3/meta',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return
    }
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    // console.log(`>>>>> API: Meta ${req.url}, prefix = ${prefix}`)
    const meta = await manifest.deriveMetadata(prefix)
    console.log(`>>>>> API: Meta ${req.url}, prefix = ${prefix} -- returning meta=${JSON.stringify(meta)}`)
    return api.okJson(res, meta)
  }
}
