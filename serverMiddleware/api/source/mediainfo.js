const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const u = require('../../user/userUtil')
const src = require('../../source/sourceUtil')

export default {
  path: '/api/source/mediainfo',
  async handler (req, res) {
    const user = req.method === 'GET'
      ? await u.requireUser(req, res)
      : await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    try {
      const { source, pth } = await src.extractSourceAndPathAndConnect(req.url)
      if (!source || !pth) { return api.notFound() }
      const infoPath = system.userMediaInfoPath(source.name, pth)
      if (req.method === 'GET') {
        res.statusCode = 200
        res.contentType = 'application/json'
        await system.api.read(infoPath, chunk => res.write(chunk))
        res.end()
      } else if (req.method === 'POST') {
        req.on('data', (data) => {
          const values = JSON.parse(data.toString())
          values.mtime = Date.now()
          const info = JSON.stringify(values)
          system.api.writeFile(infoPath, info)
            .then(() => {
              src.flushListCache()
              api.okJson(res, info)
            })
            .catch((err) => {
              logger.log(`error writing mediainfo file ${infoPath}: ${err}`)
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
