const api = require('../../util/api')
const valid = require('../../../shared/type/validation')
const u = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/user/inviteFriends',
  async handler (req, res) {
    const user = await u.requireLoggedInUser(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    req.on('data', (data) => {
      const emails = JSON.parse(data.toString())
      const emailList = valid.findValidEmails(emails)
      if (emailList.length === 0) {
        return api.validationFailed(res, { email: ['required'] })
      }
      u.sendInvitations(user, emailList).then(
        results => api.okJson(res, results),
        (err) => {
          const message = `inviteFriends: sendInvitations error: ${err}`
          logger.error(message)
          return api.serverError(res, message)
        })
    })
  }
}
