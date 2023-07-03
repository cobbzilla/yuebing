
const { MobilettoOrmValidationError } = require('mobiletto-orm-typedef')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const { USER_TYPEDEF } = require('../../../shared/type/userType')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const handleSearch = async (caller, req, res, data) => {
  const query = JSON.parse(data)
  try {
    const users = await userAdmin.findUsers(query)
    return api.okJson(res, users)
  } catch (err) {
    const message = `users: findUsers error: ${err}`
    logger.info(message)
    return api.serverError(res, message)
  }
}

const handleCreate = async (caller, req, res, data) => {
  if (!u.isAdmin(caller)) return api.forbidden(res)
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

const handleUpdate = async (caller, req, res, data) => {
  const user = JSON.parse(data)
  if (!u.isAdmin(caller) && USER_TYPEDEF.id(caller) !== USER_TYPEDEF.id(user)) {
    return api.forbidden(res)
  }
  try {
    return await u.updateUserRecord(user, created => api.okJson(res, created))
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
  const deleted = await userAdmin.deleteUser(emailOrUsername)
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
      handler = handleSearch

    } else if (req.method === 'PUT') {
      handler = handleCreate

    } else if (req.method === 'PATCH') {
      handler = handleUpdate
    }
    if (handler) {
      req.on('data', async data => await handler(caller, req, res, data))
    } else {
      return api.serverError(res, req.method)
    }
  }
}
