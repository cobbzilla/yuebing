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
    try {
      const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
      if (!source || !pth) { return api.okJson(res, []) }
      console.log(`>>>>> API: Listing ${req.url}, source=${source.name}, prefix=${pth}`)
      const results = await source.list(pth)
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result.mediaType && result.mediaType !== m.UNKNOWN_MEDIA_TYPE) {
          result.meta = await manifest.deriveMetadata(source, result.name)
        }
      }
      return api.okJson(res, results)
    } catch (e) {
      return api.serverError(res, 'error listing')
    }
  }
}
