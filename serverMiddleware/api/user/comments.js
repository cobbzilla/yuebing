const { dirname, basename } = require('path')
const LRU = require('lru-cache')

const { gravatarEmailUrl } = require('../../../shared/type/userType')

const system = require('../../util/config').SYSTEM
const logger = system.logger

const api = require('../../util/api')
const { currentUser, isAdminOrVerified, findUser } = require('../../user/userUtil')
const {
  addComment, editComment, removeComment, findCommentsForPath
} = require('../../user/commentUtil')

const AVATAR_CACHE = new LRU({ max: 1000 })

const listCommentsHandler = async (user, path) => {
  const comments = await findCommentsForPath(user, path)
  const promises = []
  promises.push(...comments.map(c => new Promise(async (resolve) => {
    try {
      if (typeof AVATAR_CACHE[c.author] !== 'undefined') {
        if (AVATAR_CACHE[c.author] !== null) {
          c.avatar = AVATAR_CACHE[c.author]
        }
      } else {
        const author = await findUser(c.author)
        if (author && author.email) {
          c.avatar = gravatarEmailUrl(author.email)
        } else {
          c.avatar = gravatarEmailUrl(c.author)
        }
        AVATAR_CACHE[c.author] = c.avatar
      }
    } catch (e) {
      logger.error(`listCommentsHandler: error finding user for comment: ${c.author}: ${e}`)
    } finally {
      resolve()
    }
  })))
  await Promise.all(promises)
  return comments
}

const newCommentHandler = async (user, path, req, res, comment) => {
  try {
    return api.okJson(res, await addComment(user, path, JSON.parse(comment)))
  } catch (e) {
    logger.error(`newCommentHandler error: ${e}`)
    return api.serverError(res)
  }
}

const editCommentHandler = async (user, path, req, res, updateJson) => {
  const update = JSON.parse(updateJson)
  try {
    return api.okJson(res, await editComment(user, path, update.id, update.comment))
  } catch (e) {
    logger.error(`editCommentHandler error: ${e}`)
    return api.serverError(res)
  }
}

const removeCommentHandler = async (user, path, req, res, commentId) => {
  try {
    return api.okJson(res, await removeComment(user, path, commentId))
  } catch (e) {
    logger.error(`removeCommentHandler error: ${e}`)
    return api.serverError(res)
  }
}

const requestHandlers = {
  POST: newCommentHandler,
  PUT: editCommentHandler
}

export default {
  path: '/api/user/comments',
  async handler (req, res) {
    const user = await currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.forbidden(res)
    }
    if (!user && req.method !== 'GET') {
      return api.forbidden(res)
    }
    try {
      const sourceAndPath = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url
      if (req.method === 'GET') {
        return api.okJson(res, await listCommentsHandler(user, sourceAndPath))
      }
      if (req.method === 'DELETE') {
        return api.okJson(await removeCommentHandler(user, dirname(sourceAndPath), req, res, basename(sourceAndPath)))
      }
      const reqHandler = requestHandlers[req.method]
      if (!reqHandler) {
        logger.error(`/api/source/comments: unsupported request method: ${req.method}`)
        return api.okJson(res, [])
      }
      req.on('data', data => reqHandler(user, sourceAndPath, req, res, data))
    } catch (e) {
      return api.handleSourceError(res, e)
    }
  }
}
