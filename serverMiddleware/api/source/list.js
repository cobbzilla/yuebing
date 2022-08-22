const m = require('../../../shared/media')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/list',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const { source, path } = src.extractSourceAndPathAndConnect(req.url)
    console.log(`>>>>> API: Listing ${req.url}, source=${source.name}, prefix=${path}`)
    const results = await source.list(path)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.mediaType && result.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
        result.meta = await manifest.deriveMetadata(source, result.name)
      }
    }
    return api.okJson(res, results)
  }
}
