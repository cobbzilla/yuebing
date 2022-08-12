const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')

export default {
  path: '/api/user/delete',
  handler (req, res) {
    console.log(`>>>>> API: Delete ${req.url} ....`)
    req.on('data', async () => {
      const caller = await u.requireLoggedInUser(req, res)
      if (!caller || !caller.email) {
        return api.forbidden(res)
      }
      try {
        userAdmin.deleteUser(caller.email).then(
          () => {
            u.cancelSessions(caller)
            api.okJson(res, { deleted: true })
          },
          (err) => {
            const message = `deleteUser(${caller.email}): error calling userAdmin.deleteUser: ${err}`
            console.error(message)
            return api.serverError(res, message)
          })

        return api.okJson(res, {})
      } catch (e) {
        return api.handleValidationError(res, e)
      }
    })
  }
}
