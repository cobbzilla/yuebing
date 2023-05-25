const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const { currentUser, isAdminOrVerified } = require('../../user/userUtil')
const manifest = require('../../asset/manifest')
const cache = require('../../util/cache')
const vol = require('../../volume/volumeUtil')

export default {
  path: '/api/source/meta',
  async handler (req, res) {
    const user = await currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.forbidden(res)
    }
    try {
      const { source, pth } = await vol.extractVolumeAndPathAndConnect(req.url)
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
