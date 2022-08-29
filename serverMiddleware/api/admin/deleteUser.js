const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/admin/deleteUser',
  async handler (req, res) {
    const caller = await u.requireAdmin(req, res)
    if (!caller) {
      return api.forbidden(res)
    }
    req.on('data', (data) => {
      const payload = JSON.parse(data.toString())
      if (!payload.email) {
        return api.validationFailed(res, { email: ['required'] })
      }
      const email = payload.email
      u.findUser(email).then(
        (user) => {
          if (user.email === caller.email) {
            return api.validationFailed(res, { email: ['cannotDeleteSelf'] })
          }
          userAdmin.deleteUser(user.email).then(
            () => api.okJson(res, { deleted: true }),
            (err) => {
              const message = `deleteUser: error calling userAdmin.deleteUser: ${err}`
              logger.error(message)
              return api.serverError(res, message)
            })
        },
        (err) => {
          const message = `deleteUser: findUser error: ${err}`
          logger.error(message)
          return api.serverError(res, message)
        }
      )
    })
  }
}
