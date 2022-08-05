const video = require('../asset/xform')
const m = require('../../shared/media')
const s3util = require('./s3util')

export default {
  path: '/s3/scan',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`'>>>>> API: Scanning ${req.url}, prefix = ${prefix}`)
    const results = await s3util.listSource(prefix)
    const transforms = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (m.hasProfiles(result.name)) {
        console.log(`>>>>> SCAN: queueing source: ${result.name}`)
        transforms.push(result)
        setTimeout(() => {
          video.transform(result.name).then((meta) => {
            console.log(`TRANSFORM-RESULT (${result.name}) = ${JSON.stringify(meta)}`)
          })
        }, 250)
      }
    }
    res.end(JSON.stringify(transforms))
  }
}
