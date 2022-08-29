const { MobilettoNotFoundError } = require('mobiletto')
const auth = require('../../../shared/auth')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/user/requestPasswordReset',
  handler (req, res) {
    req.on('data', (data) => {
      const params = JSON.parse(data.toString())
      if (!params[auth.VERIFY_EMAIL_PARAM]) {
        return api.validationFailed(res, { email: ['required'] })
      }
      const email = params[auth.VERIFY_EMAIL_PARAM]
      u.findUser(email).then(
        (user) => {
          u.sendResetPasswordMessage(user)
          return api.okJson(res, {})
        },
        (err) => {
          // It's OK, the user might not exist. We don't want to leak that information
          // back to the caller
          if (err instanceof MobilettoNotFoundError) {
            return api.okJson(res, {})
          } else {
            const message = `requestPasswordReset: findUser error: ${err}`
            logger.warn(message)
            return api.serverError(res, message)
          }
        })
    })
  }
}
