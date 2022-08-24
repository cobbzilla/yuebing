const api = require('../../util/api')
const u = require('../../user/userUtil')

export default {
  path: '/api/user/register',
  handler (req, res) {
    console.log(`>>>>> API: Register ${req.url} ....`)
    req.on('data', async (data) => {
      const regRequest = JSON.parse(data.toString())
      try {
        await u.registerUser(regRequest, u.newSessionResponse(res))
      } catch (e) {
        return api.handleValidationError(res, e)
      }
    })
  }
}
