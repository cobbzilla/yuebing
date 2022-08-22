const api = require('../../util/api')
const u = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM

export default {
  path: '/api/admin/config',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    if (req.method === 'GET') {
      res.statusCode = 200
      res.contentType = 'application/json'
      res.write(JSON.stringify({
        publicConfig: system.publicConfig,
        privateConfig: system.privateConfig
      }))
      res.end()
    } else if (req.method === 'POST') {
      req.on('data', (data) => {
        const newConfig = JSON.parse(data)
        const errors = system.updateConfig(newConfig)
        return errors
          ? api.validationFailed(res, errors)
          : api.okJson({
            publicConfig: system.publicConfig,
            privateConfig: system.privateConfig
          })
      })
    } else {
      return api.badRequest(res, 'HTTP method must be GET or POST')
    }
  }
}
