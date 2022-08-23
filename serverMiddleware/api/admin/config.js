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
      req.on('data', async (data) => {
        const newConfig = JSON.parse(data)
        try {
          const errors = await system.updateConfig(newConfig)
          return Object.keys(errors).length > 0
            ? api.validationFailed(res, errors)
            : api.okJson(res, {
              publicConfig: system.publicConfig,
              privateConfig: system.privateConfig
            })
        } catch (e) {
          const message = `error updating config: ${JSON.stringify(e)}`
          console.error(message)
          return api.serverError(res, message)
        }
      })
    } else {
      return api.badRequest(res, 'HTTP method must be GET or POST')
    }
  }
}
