const c = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const vol = require('../../volume/volumeUtil')
const shared_vol = require('../../../shared/volume')
const v = require('../../../shared/validation')
const scan = require('../../volume/scan')
const { reindex, reindexInfo } = require('../../volume/reindex')
const { queryParamValue } = require('../../util/api')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const REINDEX_PARAM = 'reindex'
const SYNC_PARAM = 'sync'

function handleVolumeError (res, e, volumeName) {
  if (e instanceof vol.VolumeNotFoundError) {
    return api.notFound(res, volumeName)
  }
  return api.serverError(res, e)
}

async function handleAdd (res, volume) {
  if (await vol.volumeExists(volume.name)) {
    return api.handleValidationError(res, { name: [ 'alreadyExists' ] })
  }
  const errors = await v.validate(volume, false, shared_vol.VOLUME_VALIDATIONS)
  if (!c.empty(errors)) {
    return api.handleValidationError(res, errors)
  } else {
    const typeConfig = v.expandedRules(shared_vol.volumeTypeConfig(volume.type))
    if (!typeConfig) {
      return api.handleValidationError(res, { type: 'invalid' })
    }
    const driverErrors = await v.validate(volume, false, typeConfig)
    if (!c.empty(driverErrors)) {
      return api.handleValidationError(res, driverErrors)
    }
  }
  try {
    return api.okJson(res, await vol.createVolume(volume))
  } catch (e) {
    return api.serverError(res, `Error creating volume: ${JSON.stringify(e)}`)
  }
}

async function handleDelete (res, name) {
  const volume = await vol.findVolume(name)
  if (!volume || c.isSelfVolume(volume)) {
    return api.notFound(res, name)
  }
  vol.deleteVolume(volume.name).then(
    () => api.okJson(res, { deleted: true }),
    (err) => {
      const message = `handleDelete: error calling deleteVolume: ${err}`
      logger.error(message)
      return handleVolumeError(res, err, name)
    })
}

async function handleQuery (res, query) {
  return api.okJson(res, await vol.listVolumes(query))
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

const handleSync = (volumeName, sync) => async (res, name) => {
  if (volumeName !== name) {
    throw new TypeError(`handleSync: Expected destination named ${volumeName} but received ${name}`)
  }
  try {
    return api.okJson(res, await vol.setSync(name, sync))
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
    if (e instanceof vol.VolumeNotFoundError) {
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
    const rawSync = queryParamValue(req, SYNC_PARAM)
    const sync = rawSync != null ? rawSync === 'true' : null
    let handler
    try {
      switch (req.method) {
        case 'GET':
          return reindex
            ? api.okJson(res, await reindexInfo(volName))
            : api.okJson(res, await vol.findVolume(volName))
        case 'DELETE':
          return await handleDelete(res, volName)
        case 'PUT':
          handler = handleAdd
          break
        case 'POST':
          handler = handleQuery
          break
        case 'PATCH':
          if (sync != null) {
            handler = handleSync(volName, sync)
          } else {
            handler = reindex ? handleReindex(volName) : handleScan(volName)
          }
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
