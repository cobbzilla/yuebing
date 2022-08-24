const api = require('../../util/api')
const u = require('../../user/userUtil')

export default {
  path: '/api/user/update',
  handler (req, res) {
    console.log(`>>>>> API: Update ${req.url} ....`)
    req.on('data', async (data) => {
      const caller = await u.requireLoggedInUser(req, res)
      if (!caller) {
        return api.forbidden(res)
      }
      const update = JSON.parse(data.toString())

      // email field cannot be changed
      if (update.email !== caller.email) {
        console.warn(`update: caller (${caller.email}) tried to change email address to ${update.email}`)
        return api.validationFailed(res, { email: ['readOnly'] })
      }
      // we don't want to update these anyway
      delete update.password
      delete update.hashedPassword
      try {
        await u.updateUserRecord(update, u.newSessionResponse(res))
      } catch (e) {
        return api.handleValidationError(res, e)
      }
    })
  }
}
