const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const { currentUser, isAdminOrVerified } = require('../../user/userUtil')
const { reindexPath } = require('../../source/reindex')
const src = require('../../source/sourceUtil')
const { deriveMediaInfo, deriveMetadata, flushMediaInfoCache } = require('../../asset/manifest')

export default {
  path: '/api/source/mediainfo',
  async handler (req, res) {
    const user = currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.forbidden(res)
    }
    if (!user && req.method !== 'GET') {
      return api.forbidden(res)
    }
    try {
      const sourceAndPath = req.url
      const { source, pth } = await src.extractSourceAndPathAndConnect(sourceAndPath)
      if (!source || !pth) { return api.notFound() }
      if (req.method === 'GET') {
        const meta = await deriveMetadata(source, pth)
        if (meta) {
          const mediainfo = await deriveMediaInfo(meta, sourceAndPath)
          if (mediainfo) {
            return api.okJson(res, mediainfo)
          }
        }
        return api.notFound(res, sourceAndPath)
      } else if (req.method === 'POST') {
        req.on('data', (data) => {
          const values = JSON.parse(data.toString())
          values.mtime = Date.now()
          const info = JSON.stringify(values)
          const infoPath = system.userMediaInfoPath(source.name, pth)
          system.api.writeFile(infoPath, info)
            .then(() => {
              flushMediaInfoCache(sourceAndPath)
              reindexPath(sourceAndPath)
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
      return api.handleSourceError(res, e)
    }
  }
}
