const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/admin/users',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    req.on('data', (data) => {
      const query = JSON.parse(data.toString())
      userAdmin.findUsers(query).then(
        results => api.okJson(res, results),
        (err) => {
          const message = `users: findUsers error: ${err}`
          logger.info(message)
          return api.serverError(res, message)
        }
      )
    })
  }
}
