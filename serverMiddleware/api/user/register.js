const api = require('../../util/api')
const u = require('../../user/userUtil')

export default {
  path: '/api/user/register',
  handler (req, res) {
    req.on('data', async (data) => {
      const caller = await u.currentUser(req)
      const regRequest = JSON.parse(data.toString())
      try {
        const newUser = await u.registerUser(caller, regRequest)
        return u.newSessionResponse(res, newUser)
      } catch (e) {
        return api.handleValidationError(res, typeof e.errors !== 'undefined' ? e.errors : e)
      }
    })
  }
}
