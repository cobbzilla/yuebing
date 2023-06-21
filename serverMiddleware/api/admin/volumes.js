const { MobilettoOrmValidationError, MobilettoOrmNotFoundError } = require('mobiletto-orm-typedef')

const c = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const vol = require('../../model/morm/volumeDb')
const system = require('../../util/config').SYSTEM
const logger = system.logger

function handleVolumeError (res, e, volumeName) {
  if (e instanceof MobilettoOrmNotFoundError) {
    return api.notFound(res, volumeName)
  } else if (e instanceof MobilettoOrmValidationError) {
    return api.validationFailed(res, e.errors)
  }
  return api.serverError(res, e)
}

async function handleAdd (res, volume) {
  try {
    return api.okJson(res, await vol.volumeDb.create(volume))
  } catch (e) {
    if (e instanceof MobilettoOrmValidationError) {
      return api.handleValidationError(res, e.errors)
    }
    return api.serverError(res, `Error creating volume: ${JSON.stringify(e)}`)
  }
}

async function handleEdit (res, volume) {
  const id = vol.volumeDb.typeDef.id(volume)
  if (!id) {
    return api.serverError(res, `handleEdit: no id could be determined from object: ${JSON.stringify(volume)}`)
  }
  try {
    const found = await vol.volumeDb.findById(id)
    const updated = await vol.volumeDb.update(volume, found)
    return api.okJson(res, updated)
  } catch (e) {
    if (e instanceof MobilettoOrmNotFoundError) {
      return api.notFound(res, id)
    }
    if (e instanceof MobilettoOrmValidationError) {
      return api.handleValidationError(res, e.errors)
    }
    return api.serverError(res, `Error creating volume: ${JSON.stringify(e)}`)
  }
}

async function handleDelete (res, name) {
  const volume = await vol.volumeDb.findById(name)
  if (!volume || c.isSelfVolume(volume)) {
    return api.notFound(res, name)
  }
  try {
    await vol.volumeDb.delete(volume.name)
    return api.okJson(res, { deleted: true })
  } catch (e) {
    const message = `handleDelete: error calling deleteVolume: ${err}`
    logger.error(message)
    return handleVolumeError(res, e, name)
  }
}

async function handleQuery (res, query) {
  return api.okJson(res, await vol.volumeDb.list(query))
}

export default {
  path: '/api/admin/volumes',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const path = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const volName = path.includes('?') ? path.substring(0, path.indexOf('?')) : path
    let handler
    try {
      switch (req.method) {
        case 'GET':
          return api.okJson(res, await vol.volumeDb.findById(volName))
        case 'DELETE':
          return await handleDelete(res, volName)
        case 'PUT':
          handler = handleAdd
          break
        case 'POST':
          handler = handleQuery
          break
        case 'PATCH':
          handler = handleEdit
          break
        default:
          return api.serverError(res, c.HTTP_INVALID_REQUEST_MESSAGE)
      }
    } catch (e) {
      return handleVolumeError(res, e, volName)
    }
    req.on('data', async data => await handler(res, JSON.parse(data)))
  }
}
