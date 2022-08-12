const auth = require('../../../shared/auth')
const api = require('../../util/api')
const u = require('../../user/userUtil')

export default {
  path: '/api/user/verify',
  async handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`>>>>> API: Verifying user(s) ${req.url}, prefix = ${prefix}`)
    if (!req.url.includes('?')) {
      return api.validationFailed(res, { verifyToken: ['required'] })
    }
    const query = new URLSearchParams(req.url.substring(req.url.indexOf('?')))
    const errors = {}
    if (!query.has(auth.VERIFY_EMAIL_PARAM)) {
      errors.email = ['required']
    }
    if (!query.has(auth.VERIFY_TOKEN_PARAM)) {
      errors.verifyToken = ['required']
    }
    if (Object.keys(errors).length > 0) {
      return api.validationFailed(res, errors)
    }
    const email = query.get(auth.VERIFY_EMAIL_PARAM)
    const token = query.get(auth.VERIFY_TOKEN_PARAM)
    const correct = await u.isCorrectVerifyToken(email, token)
    if (!correct) {
      return api.validationFailed(res, { verifyToken: ['invalid'] })
    }
    const user = await u.findUser(email)
    if (!user) {
      return api.validationFailed(res, { email: ['invalid'] })
    }
    user.verified = Date.now()
    u.updateUserRecord(user, (data, newUser) => {
      u.startSession(newUser).then(u => api.okJson(res, u))
    })
  }
}
