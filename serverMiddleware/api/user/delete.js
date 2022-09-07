const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/user/delete',
  handler (req, res) {
    logger.info(`>>>>> API: Delete ${req.url} ....`)
    req.on('data', async () => {
      const caller = await u.requireLoggedInUser(req, res)
      if (!caller || !caller.email) {
        return api.forbidden(res)
      }
      try {
        userAdmin.deleteUser(caller).then(
          () => {
            u.cancelSessions(caller)
            api.okJson(res, { deleted: true })
          },
          (err) => {
            const message = `deleteUser(${caller.email}): error calling userAdmin.deleteUser: ${err}`
            logger.error(message)
            return api.serverError(res, message)
          })

        return api.okJson(res, {})
      } catch (e) {
        return api.handleValidationError(res, e)
      }
    })
  }
}
