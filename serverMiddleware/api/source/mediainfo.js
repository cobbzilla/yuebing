const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const { currentUser, isAdminOrVerified } = require('../../user/userUtil')
const { reindexPath } = require('../../volume/reindex')
const vol = require('../../model/morm/volumeDb')
const { deriveMediaInfo, deriveMetadata, flushMediaInfoCache } = require('../../asset/manifest')
const { MobilettoNotFoundError } = require('mobiletto-lite')

export default {
  path: '/api/source/mediainfo',
  async handler (req, res) {
    const user = await currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.forbidden(res)
    }
    if (!user && req.method !== 'GET') {
      return api.forbidden(res)
    }
    try {
      const volumeAndPath = req.url.replaceAll('//', '/')
      const { volume, pth } = await vol.extractVolumeAndPathAndConnect(volumeAndPath)
      if (!volume || !pth) { return api.notFound() }
      if (req.method === 'GET') {
        const meta = await deriveMetadata(volume, pth)
        if (meta) {
          const mediainfo = await deriveMediaInfo(meta, volumeAndPath)
          if (mediainfo) {
            return api.okJson(res, mediainfo)
          }
        }
        return api.notFound(res, volumeAndPath)
      } else if (req.method === 'POST') {
        req.on('data', (data) => {
          const values = JSON.parse(data.toString())
          values.mtime = Date.now()
          const info = JSON.stringify(values)
          const infoPath = system.userMediaInfoPath(volume.name, pth)
          system.storage.writeFile(infoPath, info)
            .then(() => {
              flushMediaInfoCache(volumeAndPath)
              reindexPath(volumeAndPath)
              api.okJson(res, info)
            })
            .catch((err) => {
              logger.info(`error writing mediainfo file ${infoPath}: ${err}`)
              return api.serverError(res, 'error writing mediainfo file')
            })
        })
      } else {
        return api.badRequest(res, 'HTTP method must be GET or POST')
      }
    } catch (e) {
      if (e instanceof MobilettoNotFoundError) {

      }
      return api.handleSourceError(res, e)
    }
  }
}
