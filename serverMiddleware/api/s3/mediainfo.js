const util = require('../../util/file')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const s3util = require('../../s3/s3util')

const USER_MEDIAINFO_JSON = 'userMediaInfo.json'

export default {
  path: '/api/s3/mediainfo',
  async handler (req, res) {
    const user = req.method === 'GET'
      ? await u.requireUser(req, res)
      : await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const url = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url
    const path = url === '/undefined' ? '' : url.startsWith('/') ? url.substring(1) : req.url
    const Key = util.canonicalDestDir(path) + USER_MEDIAINFO_JSON
    if (req.method === 'GET') {
      res.statusCode = 200
      await s3util.streamDestObject(Key, res)
      res.end()
    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        const values = JSON.parse(data.toString())
        values.mtime = Date.now()
        const Body = JSON.stringify(values)
        const bucketParams = { Key, Body }
        s3util.destPut(bucketParams, `mediainfo: error writing mediainfo ${path}`)
        return api.okJson(res, Body)
      })
    } else {
      return api.badRequest(res, 'HTTP method must be GET or POST')
    }
  }
}
