const { basename, dirname } = require('path')

const { NO_CACHE_HEADER } = require('../../../shared')
const { deriveMetadataFromSourceAndPath } = require('../../asset/manifest')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const { reindexPath } = require('../../source/reindex')
const { scanPath } = require('../../source/scan')

const doIndex = async (req, res, sourceAndPath) => {
  await reindexPath(sourceAndPath)
  return api.okJson(res, {})
}

const doScan = async (req, res, sourceAndPath) => {
  logger.info(`doScan: calling scanPath(${sourceAndPath})`)
  const result = await scanPath(sourceAndPath)
  logger.info(`doScan: scanPath(${sourceAndPath}) returned ${result}`)
  return api.okJson(res, result || {})
}

const doMeta = async (req, res, sourceAndPath) => {
  const noCache = req.headers && req.headers[NO_CACHE_HEADER]
  return api.okJson(await deriveMetadataFromSourceAndPath(sourceAndPath, { noCache }))
}

const doDelete = async (req, res, sourceAndPath) => {
  try {
    await system.deletePath(sourceAndPath)
    return api.okJson(res, {})
  } catch (e) {
    return api.serverError(res, `doDelete: error calling system.deletePath: ${e}`)
  }
}

const operationHandlers = {
  index: { handle: doIndex, method: 'GET' },
  scan: { handle: doScan, method: 'GET' },
  delete: { handle: doDelete, method: 'DELETE' },
  meta: { handle: doMeta, method: 'GET' }
}

export default {
  path: '/api/admin/paths',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return api.forbidden(res)
    }
    const url = req.url.startsWith('/') ? req.url.substring(1) : req.url
    const operation = basename(url)
    const handler = operationHandlers[operation]
    if (!handler) {
      return api.notFound(res, url)
    }
    if (req.method !== handler.method) {
      return api.notFound(res, url)
    }
    const path = dirname(url)
    logger.info(`/api/admin/paths -- performing '${operation}' on: ${path}`)
    return await handler.handle(req, res, path)
  }
}
