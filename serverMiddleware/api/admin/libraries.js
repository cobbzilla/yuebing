const c = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const vol = require('../../volume/volumeUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

function handleLibraryError (res, e, libraryName) {
  if (e instanceof vol.LibraryNotFoundError) {
    return api.notFound(res, libraryName)
  }
  if (e instanceof vol.LibraryValidationError) {
    return api.handleValidationError(res, e.errors)
  }
  return api.serverError(res, e)
}

async function handleAdd (res, library) {
  try {
    return api.okJson(res, await vol.createLibrary(library))
  } catch (e) {
    return handleLibraryError(res, e, library.name)
  }
}

async function handleUpdate (res, library) {
  try {
    return api.okJson(res, await vol.updateLibrary(library))
  } catch (e) {
    return handleLibraryError(res, e, library.name)
  }
}

async function handleDelete (res, name) {
  return await vol.findLibrary(name).then(
    (library) => {
      if (library.name !== name) {
        return api.serverError(res, `handleDelete: found library with name ${library.name} but expected name ${name}`)
      }
      vol.deleteLibrary(name).then(
        () => api.okJson(res, { deleted: true }),
        (err) => {
          const message = `handleDelete: error calling deleteLibrary: ${err}`
          logger.error(message)
          return api.serverError(res, message)
        })
    },
    err => handleLibraryError(res, err, name)
  )
}

async function handleQuery (res, query) {
  return api.okJson(res, await vol.listLibraries(query))
}

export default {
  path: '/api/admin/libraries',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const path = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const libraryId = path.includes('?') ? path.substring(0, path.indexOf('?')) : path
    let handler
    try {
      switch (req.method) {
        case 'GET':
          return api.okJson(res, await vol.listLibraries())
        case 'DELETE':
          return await handleDelete(res, libraryId)
        case 'PUT':
          handler = handleAdd
          break
        case 'PATCH':
          handler = handleUpdate
          break
        case 'POST':
          handler = handleQuery
          break
        default:
          return api.serverError(res, c.HTTP_INVALID_REQUEST_MESSAGE)
      }
    } catch (e) {
      return handleLibraryError(res, e, libraryId)
    }
    req.on('data', async data => await handler(res, JSON.parse(data)))
  }
}
