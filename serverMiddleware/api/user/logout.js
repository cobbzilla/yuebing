const api = require('../../util/api')
const u = require('../../user/userUtil')

export default {
  path: '/api/user/logout',
  handler (req, res) {
    try {
      const user = u.currentUser(req)
      if (user) {
        api.clearSessionCookie(res, user.session)
      }
    } catch (e) {
      console.warn(`logout: ${e}`)
    }
    return api.okJson(res, {})
  }
}
