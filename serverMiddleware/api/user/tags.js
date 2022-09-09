const { dirname, basename } = require('path')

const { extractSourceAndPath } = require('../../../shared/source')
const { isAdminOrVerified } = require('../../user/userUtil')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const { currentUser } = require('../../user/userUtil')
const { addTag, removeTag, getTagsForPath } = require('../../user/tagUtil')

const listTagsHandler = async (req, res, user, path) => {
  return api.okJson(res, await getTagsForPath(path))
}

const addTagsHandler = async (req, res, user, path, tags) => {
  try {
    await addTag(path, tags)
    return api.okJson(res, await getTagsForPath(path))
  } catch (e) {
    logger.error(`addTagHandler error: ${e}`)
    return api.serverError(res)
  }
}

const removeTagHandler = async (req, res, user, path, tags) => {
  try {
    await removeTag(path, tags)
    return api.okJson(res, await getTagsForPath(path))
  } catch (e) {
    logger.error(`removeTagHandler error: ${e}`)
    return api.serverError(res)
  }
}

export default {
  path: '/api/user/tags',
  async handler (req, res) {
    const user = await currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.forbidden(res)
    }
    if (!user && req.method !== 'GET') {
      return api.forbidden(res)
    }
    try {
      const { sourceName, pth } = extractSourceAndPath(req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url)
      const sourceAndPath = `${sourceName}/${pth}`
      switch (req.method) {
        case 'GET':
          return await listTagsHandler(req, res, user, sourceAndPath)
        case 'DELETE':
          return await removeTagHandler(req, res, user, dirname(sourceAndPath), atob(basename(sourceAndPath)).split(','))
        case 'POST':
          return req.on('data', tags => addTagsHandler(req, res, user, sourceAndPath, JSON.parse(tags)))
        default:
          return api.badRequest(res)
      }
    } catch (e) {
      return api.handleSourceError(res, e)
    }
  }
}
