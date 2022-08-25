const system = require('../../util/config').SYSTEM
const api = require('../../util/api')
const u = require('../../user/userUtil')
const src = require('../../source/sourceUtil')

const USER_MEDIAINFO_JSON = 'userMediaInfo.json'

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
      const infoPath = system.assetsDir(source.name + '/' + pth) + USER_MEDIAINFO_JSON
      if (req.method === 'GET') {
        res.statusCode = 200
        res.contentType = 'application/json'
        await source.read(infoPath, chunk => res.write(chunk))
        res.end()
      } else if (req.method === 'POST') {
        req.on('data', (data) => {
          const values = JSON.parse(data.toString())
          values.mtime = Date.now()
          const info = JSON.stringify(values)
          source.writeFile(infoPath, info)
            .then(() => api.okJson(res, info))
            .catch((err) => {
              console.log(`error writing mediainfo file ${infoPath}: ${err}`)
              api.serverError(res, 'error writing mediainfo file')
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
