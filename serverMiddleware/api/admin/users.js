const { MobilettoOrmValidationError } = require('mobiletto-orm-typedef')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const handleSearchOrEdit = async (caller, req, res, data) => {
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
}

const handleCreate = async (caller, req, res, data) => {
  const user = JSON.parse(data)
  try {
    const created = await u.registerUser(caller, user)
    return api.okJson(res, created)
  } catch (e) {
    if (e instanceof MobilettoOrmValidationError || e instanceof u.UserValidationError) {
      return api.validationFailed(res, e.errors)
    } else {
      return api.serverError(res, `handleCreate failed: ${e}`)
    }
  }
}

const handleDelete = async (caller, req, res) => {
  const slash = req.url.indexOf('/')
  if (slash === -1) {
    return api.serverError(res, 'no username or email')
  }
  const emailOrUsername = req.url.substring(slash+1)
  const deleted = userAdmin.deleteUser(emailOrUsername)
  if (deleted == null) {
    return api.notFound(res, emailOrUsername)
  }
  return api.okJson(res, deleted)
}

export default {
  path: '/api/admin/users',
  async handler (req, res) {
    const caller = await u.requireAdmin(req, res)
    if (!caller) {
      return api.forbidden(res)
    }
    let handler = null
    if (req.method === 'DELETE') {
      return handleDelete(caller, req, res)

    } else if (req.method === 'POST') {
      handler = handleSearchOrEdit

    } else if (req.method === 'PUT') {
      handler = handleCreate
    }
    if (handler) {
      req.on('data', async data => await handler(caller, req, res, data))
    } else {
      return api.serverError(res, req.method)
    }
  }
}
