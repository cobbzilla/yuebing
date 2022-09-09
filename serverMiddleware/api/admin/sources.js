const c = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const s = require('../../source/sourceUtil')
const v = require('../../../shared/validation')
const scan = require('../../source/scan')
const { reindex, reindexInfo } = require('../../source/reindex')
const { queryParamValue } = require('../../util/api')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const REINDEX_PARAM = 'reindex'

function handleSourceError (res, e, sourceName) {
  if (e instanceof s.SourceNotFoundError) {
    return api.notFound(res, sourceName)
  }
  return api.serverError(res, e)
}

async function handleAdd (res, source) {
  if (await s.sourceExists(source.name)) {
    return api.handleValidationError(res, { name: 'alreadyExists' })
  }
  const errors = v.validate(source)
  if (!c.empty(errors)) {
    return api.handleValidationError(res, errors)
  }
  try {
    return api.okJson(res, await s.createSource(source))
  } catch (e) {
    return api.serverError(res, `Error creating source: ${JSON.stringify(e)}`)
  }
}

async function handleDelete (res, name) {
  return await s.sourceExists(name).then(
    (sourceName) => {
      if (sourceName) {
        s.deleteSource(sourceName).then(
          () => api.okJson(res, { deleted: true }),
          (err) => {
            const message = `handleDelete: error calling deleteSource: ${err}`
            logger.error(message)
            return api.serverError(res, message)
          })
      } else {
        return api.notFound(res, name)
      }
    },
    err => handleSourceError(res, err, name)
  )
}

async function handleQuery (res, query) {
  return api.okJson(res, await s.listSources(query))
}

const handleReindex = sourceName => async (res, name) => {
  if (sourceName !== name) {
    throw new TypeError(`handleReindex: Expected source named ${sourceName} but received ${name}`)
  }
  try {
    await reindex(sourceName)
    return api.okJson(res, { reindexing: true })
  } catch (e) {
    return api.serverError(res, e)
  }
}

const handleScan = sourceName => async (res, name) => {
  if (sourceName !== name) {
    throw new TypeError(`handleScan: Expected source named ${sourceName} but received ${name}`)
  }
  try {
    const source = await s.connect(name)
    const transforms = await scan.scan(source, '', { autoscan: false })
    return api.okJson(res, transforms)
  } catch (e) {
    if (e instanceof s.SourceNotFoundError) {
      return api.notFound(res, e.message)
    }
    return api.serverError(res, `Error scanning ${name}: ${JSON.stringify(e)}`)
  }
}

export default {
  path: '/api/admin/sources',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const path = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const sourceName = path.includes('?') ? path.substring(0, path.indexOf('?')) : path
    const reindex = !!queryParamValue(req, REINDEX_PARAM)
    let handler
    try {
      switch (req.method) {
        case 'GET':
          return reindex
            ? api.okJson(res, await reindexInfo(sourceName))
            : api.okJson(res, await s.findSource(sourceName))
        case 'DELETE':
          return await handleDelete(res, sourceName)
        case 'PUT':
          handler = handleAdd
          break
        case 'POST':
          handler = handleQuery
          break
        case 'PATCH':
          handler = reindex ? handleReindex(sourceName) : handleScan(sourceName)
          break
        default:
          return api.serverError(res, c.HTTP_INVALID_REQUEST_MESSAGE)
      }
    } catch (e) {
      return handleSourceError(res, e, sourceName)
    }
    req.on('data', async data => await handler(res, JSON.parse(data)))
  }
}
