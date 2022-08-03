const manifest = require('../video/manifest')

export default {
  path: '/s3/meta',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`'>>>>> API: Meta ${req.url}, prefix = ${prefix}`)
    const meta = await manifest.deriveMetadata(prefix)
    console.log(`'>>>>> API: Meta ${req.url}, prefix = ${prefix} -- returning meta=${JSON.stringify(meta)}`)
    res.end(JSON.stringify(meta))
  }
}
