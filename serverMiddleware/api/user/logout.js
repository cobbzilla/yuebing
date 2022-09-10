const api = require('../../util/api')
const { currentUser } = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/user/logout',
  async handler (req, res) {
    try {
      const user = await currentUser(req)
      if (user) {
        api.clearSessionCookie(res, user.session)
      }
    } catch (e) {
      logger.warn(`logout: ${e}`)
    }
    return api.okJson(res, {})
  }
}
