// const video = require('../asset/xform')
// const c = require('../../media')
const s3util = require('./s3util')

export default {
  path: '/s3/proxy',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`'>>>>> API: Proxying ${req.url}, prefix = ${prefix}`)
    res.statusCode = 200
    await s3util.streamDestObject(prefix, res)
    res.end()
  }
}
