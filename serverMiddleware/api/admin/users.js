const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM
const logger = system.logger

export default {
  path: '/api/admin/users',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    req.on('data', async (data) => {
      const text = data.toString()
      const parts = req.url.split('/').filter(p => p)
      if (parts.length === 2) {
        const email = parts[0]
        const operation = parts[1]
        if (operation !== 'editor') {
          return api.serverError(res, `invalid operation: ${operation}`)
        }
        const update = JSON.parse(text)
        if (typeof update.email !== 'string' || update.email.length < 5 || update.email !== email) {
          return api.serverError(res, `email field not found or invalid in request object: ${text}`)
        }
        if (typeof update.editor !== 'boolean') {
          return api.serverError(res, `editor field not found or invalid in request object: ${text}`)
        }
        const existingUser = await u.findUser(update.email)
        if (!existingUser || existingUser.email !== update.email) {
          return api.notFound(res, update.email)
        }
        existingUser.editor = update.editor
        await u.updateUserRecord(existingUser, updated => api.okJson(res, updated))
      } else {
        const query = JSON.parse(text)
        try {
          const users = await userAdmin.findUsers(query)
          return api.okJson(res, users)
        } catch (err) {
          const message = `users: findUsers error: ${err}`
          logger.info(message)
          return api.serverError(res, message)
        }
      }
    })
  }
}
