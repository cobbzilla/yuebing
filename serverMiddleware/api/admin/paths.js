const { basename, dirname } = require('path')

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
  await scanPath(sourceAndPath)
  return api.okJson(res, {})
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
  delete: { handle: doDelete, method: 'DELETE' }
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
    return await handler.handle(req, res, path)
  }
}
