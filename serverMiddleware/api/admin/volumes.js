const { MobilettoOrmValidationError, MobilettoOrmNotFoundError } = require('mobiletto-orm-typedef')

const c = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const vol = require('../../model/morm/volumeDb')
const volType = require('../../../shared/type/volumeType')
const v = require('../../../shared/type/validation')
const scan = require('../../volume/scan')
const { reindex, reindexInfo } = require('../../volume/reindex')
const { queryParamValue } = require('../../util/api')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const REINDEX_PARAM = 'reindex'

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

const handleReindex = volumeName => async (res, name) => {
  if (volumeName !== name) {
    throw new TypeError(`handleReindex: Expected source named ${volumeName} but received ${name}`)
  }
  try {
    await reindex(volumeName)
    return api.okJson(res, { reindexing: true })
  } catch (e) {
    return api.serverError(res, e)
  }
}

const handleScan = volumeName => async (res, scanConfig) => {
  if (!scanConfig || volumeName !== scanConfig.source) {
    throw new TypeError(`handleScan: Expected source named ${volumeName} but received scanConfig.source=${scanConfig.source}`)
  }
  try {
    const source = await vol.connect(scanConfig.source)
    const transforms = await scan.scan(source, scanConfig)
    return api.okJson(res, transforms)
  } catch (e) {
    if (e instanceof MobilettoOrmNotFoundError) {
      return api.notFound(res, e.message)
    }
    return api.serverError(res, `Error scanning ${scanConfig.source}: ${JSON.stringify(e)}`)
  }
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
    const reindex = !!queryParamValue(req, REINDEX_PARAM)
    let handler
    try {
      switch (req.method) {
        case 'GET':
          return reindex
            ? api.okJson(res, await reindexInfo(volName))
            : api.okJson(res, await vol.volumeDb.findById(volName))
        case 'DELETE':
          return await handleDelete(res, volName)
        case 'PUT':
          handler = handleAdd
          break
        case 'POST':
          handler = handleQuery
          break
        case 'PATCH':
          handler = reindex ? handleReindex(volName) : handleScan(volName)
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
