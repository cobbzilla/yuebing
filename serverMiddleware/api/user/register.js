const api = require('../../util/api')
const u = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/user/register',
  handler (req, res) {
    logger.info(`>>>>> API: Register ${req.url} ....`)
    req.on('data', async (data) => {
      const regRequest = JSON.parse(data.toString())
      try {
        await u.registerUser(regRequest, u.newSessionResponse(res))
      } catch (e) {
        return api.handleValidationError(res, typeof e.errors !== 'undefined' ? e.errors : e)
      }
    })
  }
}
