const auth = require('../../../shared/auth')
const api = require('../../util/api')
const u = require('../../user/userUtil')

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
        user => u.sendResetPasswordMessage(user),
        (err) => {
          console.log(`requestPasswordReset: findUser error: ${err}`)
        })
      return api.okJson(res, {})
    })
  }
}
