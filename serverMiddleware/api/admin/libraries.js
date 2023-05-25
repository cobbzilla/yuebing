const c = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const vol = require('../../volume/volumeUtil')
const v = require('../../../shared/validation')
const { queryParamValue } = require('../../util/api')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const REINDEX_PARAM = 'reindex'

function handleLibraryError (res, e, libraryName) {
  if (e instanceof vol.LibraryNotFoundError) {
    return api.notFound(res, libraryName)
  }
  return api.serverError(res, e)
}

async function handleAdd (res, library) {
  if (await vol.libraryExists(library.name)) {
    return api.handleValidationError(res, { name: 'alreadyExists' })
  }
  const errors = await v.validate(library)
  if (!c.empty(errors)) {
    return api.handleValidationError(res, errors)
  }
  try {
    return api.okJson(res, await vol.createLibrary(library))
  } catch (e) {
    return api.serverError(res, `Error creating library: ${JSON.stringify(e)}`)
  }
}

async function handleDelete (res, name) {
  return await vol.libraryExists(name).then(
    (libraryName) => {
      if (libraryName) {
        vol.deleteLibrary(libraryName).then(
          () => api.okJson(res, { deleted: true }),
          (err) => {
            const message = `handleDelete: error calling deleteLibrary: ${err}`
            logger.error(message)
            return api.serverError(res, message)
          })
      } else {
        return api.notFound(res, name)
      }
    },
    err => handleLibraryError(res, err, name)
  )
}

async function handleQuery (res, query) {
  return api.okJson(res, await vol.listLibraries(query))
}

export default {
  path: '/api/admin/librarys',
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
