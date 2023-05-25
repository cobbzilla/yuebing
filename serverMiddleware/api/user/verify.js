const bcrypt = require('bcryptjs')

const c = require('../../../shared')
const auth = require('../../../shared/auth')
const valid = require('../../../shared/validation')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const BCRYPT_ROUNDS = system.privateConfig.encryption.bcryptRounds

export default {
  path: '/api/user/verify',
  handler (req, res) {
    req.on('data', (data) => {
      const params = JSON.parse(data.toString())
      const errors = {}
      if (!params[auth.VERIFY_EMAIL_PARAM]) {
        errors.email = ['required']
      }
      if (!params[auth.VERIFY_TOKEN_PARAM]) {
        errors.token = ['required']
      }

      const resetPasswordHash = params[auth.VERIFY_RESET_PARAM] || null
      if (resetPasswordHash) {
        if (!params[auth.VERIFY_PASSWORD_PARAM]) {
          errors.password = ['required']
        }
      }

      if (!c.empty(errors)) {
        return api.validationFailed(res, errors)
      }

      const email = params[auth.VERIFY_EMAIL_PARAM]
      const token = params[auth.VERIFY_TOKEN_PARAM]
      const password = params[auth.VERIFY_PASSWORD_PARAM]

      if (resetPasswordHash) {
        if (u.resetShasum(email, token) !== resetPasswordHash) {
          return api.validationFailed(res, { token: ['invalid'] })
        }
      }

      u.findUser(email).then(
        async (user) => {
          user.verified ||= Date.now()
          if (resetPasswordHash) {
            // set password so we can validate it
            user.password = password
            const errors = await valid.validate(user)
            if (!c.empty(errors)) {
              return api.validationFailed(res, errors)
            }
            const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS)
            user.hashedPassword = bcrypt.hashSync(password, salt)
          }

          // check token AFTER validating user, otherwise an invalid request (invalid password) will erase the token
          const correct = await (resetPasswordHash ? u.isCorrectResetPasswordToken(email, token) : u.isCorrectVerifyToken(email, token))
          if (!correct) {
            return api.validationFailed(res, { token: ['invalid'] })
          }

          // now update the user and start a new session
          try {
            await u.updateUserRecord(user, (data, newUser) => {
              u.startSession(newUser).then(u => api.okJson(res, u))
            })
          } catch (e) {
            // we shouldn't get a validation exception during update, since we already validated above
            if (e instanceof u.UserValidationError) {
              return api.validationFailed(res, e.errors)
            } else {
              return api.serverError(res, `verify: updateUserRecord failed: ${e}`)
            }
          }
        },
        (err) => {
          logger.info(`verify: findUser error: ${err}`)
          return api.validationFailed(res, { email: ['invalid'] })
        })
    })
  }
}
