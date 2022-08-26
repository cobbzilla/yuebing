const api = require('../../util/api')
const u = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/meta',
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    try {
      const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
      if (!source || !pth) { return api.notFound() }
      const meta = await manifest.deriveMetadata(source, pth)
      return api.okJson(res, meta)
    } catch (e) {
      return api.handleSourceError(res, e)
    }
  }
}
