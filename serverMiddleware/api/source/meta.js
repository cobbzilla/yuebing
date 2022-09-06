const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const { currentUser } = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const cache = require('../../util/cache')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/meta',
  async handler (req, res) {
    const user = await currentUser(req)
    if (!user && !system.isPublic()) {
      return api.forbidden(res)
    }
    try {
      const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
      if (!source || !pth) { return api.notFound() }
      const meta = await manifest.deriveMetadata(source, pth)
      if (meta.finished) {
        const sourceAndPath = `${source}/${pth}`
        meta.selectedThumbnail = await cache.findSelectedThumbnail(sourceAndPath)
      }
      return api.okJson(res, meta)
    } catch (e) {
      return api.handleSourceError(res, e)
    }
  }
}
