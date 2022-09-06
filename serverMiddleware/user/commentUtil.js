const shasum = require('shasum')
const system = require('../util/config').SYSTEM
const logger = system.logger

const redis = require('../util/redis')

const PATH_COMMENTS = 'comments/path/'
const USER_COMMENTS = 'comments/user/'

const commentsForPath = (path) => {
  const sha = shasum(path)
  return PATH_COMMENTS + sha.substring(0, 2) + '/' + sha.substring(2, 4) + '/' + sha.substring(4, 6) + '/' + sha + '/'
}

const commentsForUser = (username) => {
  const sha = shasum(username)
  return USER_COMMENTS + sha.substring(0, 2) + '/' + sha.substring(2, 4) + '/' + sha.substring(4, 6) + '/' + sha + '/'
}

const newCommentId = (hash) => `${Date.now()}_${hash}`
const pathToSingleComment = (path, commentId) => commentsForPath(path) + commentId

const userCommentReferencePath = (username, commentId) => commentsForUser(username) + commentId

const addComment = async (user, path, comment) => {
  const newId = newCommentId(shasum(user.username + '\n' + path))
  const commentObject = {
    id: newId,
    comment,
    ctime: Date.now(),
    author: user.username
  }
  const commentJson = JSON.stringify(commentObject)
  await redis.sadd(commentCacheKeyForPath(path), commentJson)
  await system.api.writeFile(pathToSingleComment(path, newId), commentJson)
  await system.api.writeFile(userCommentReferencePath(user, newId), '~')
  logger.info(`addComment(${path}): added comment: ${commentJson}`)
  return commentObject
}

const editComment = async (user, path, commentId, comment) => {
  const updatePath = pathToSingleComment(path, commentId)
  const existingCommentJson = system.api.safeReadFile(updatePath)
  if (!existingCommentJson) {
    logger.warn(`editComment(${path}, ${commentId}): comment not found`)
    return null
  }
  const existingComment = JSON.parse(existingCommentJson)
  if (existingComment.author !== user.username && !user.admin) {
    logger.warn(`editComment(${path}, ${commentId}): user ${user.username} cannot edit comment by existingComment.author=${existingComment.author}`)
    return null
  }
  if (existingComment.id !== commentId) {
    logger.warn(`editComment(${path}, ${commentId}): existingComment.id ${existingComment.id} within JSON object did not match file path id: ${commentId}`)
    return null
  }
  await redis.srem(commentCacheKeyForPath(path), existingCommentJson)
  const updatedComment = Object.assign({}, existingComment, { comment, mtime: Date.now() })
  const updatedCommentJson = JSON.stringify(updatedComment)
  await redis.sadd(commentCacheKeyForPath(path), updatedCommentJson)
  await system.api.write(updatePath, updatedCommentJson)
  logger.info(`editComment(${path}): updated comment: ${updatedCommentJson}`)
  return updatedComment
}

const removeComment = async (user, path, commentId) => {
  const updatePath = pathToSingleComment(path, commentId)
  const existingCommentJson = system.api.safeReadFile(updatePath)
  if (!existingCommentJson) {
    logger.warn(`removeComment(${path}, ${commentId}): comment not found`)
    return null
  }
  const existingComment = JSON.parse(existingCommentJson)
  if (existingComment.id !== commentId) {
    logger.warn(`removeComment(${path}, ${commentId}): existingComment.id ${existingComment.id} within JSON object did not match file path id: ${commentId}`)
    return null
  }
  if (existingComment.author !== user.username && !user.admin) {
    logger.warn(`removeComment(${path}, ${commentId}): user ${user.username} cannot remove comment by existingComment.author=${existingComment.author}`)
    return null
  }
  await redis.srem(commentCacheKeyForPath(path), existingCommentJson)
  await system.api.remove(updatePath)
  const removed = await system.api.remove(userCommentReferencePath(user, commentId))
  logger.info(`editComment(${path}): removed comment: ${commentId}`)
  return removed
}

const COMMENTS_CACHE_PREFIX = '_comments_'

const commentCacheKeyForPath = (path) => COMMENTS_CACHE_PREFIX + shasum(path)

const findCommentsForPath = async (user, path) => {
  if (!user && !system.isPublic()) {
    return []
  }
  const cacheKey = commentCacheKeyForPath(path)
  const cached = await redis.smembers(cacheKey)
  if (cached && cached.length > 0) {
    return cached.map(c => JSON.parse(c))
      .sort((c1, c2) => c1.ctime - c2.ctime)
  }
  const commentFiles = await system.api.list(commentsForPath(path), { recursive: true })
  const comments = []
  const promises = []
  for (const commentFile of commentFiles) {
    promises.push(new Promise((resolve) => {
      system.api.safeReadFile(commentFile.name).then(
        async (data) => {
          if (data) {
            await redis.sadd(cacheKey, data)
            comments.push(JSON.parse(data))
          }
          resolve()
        })
    }))
  }
  await Promise.all(promises)
  return comments.sort((c1, c2) => c1.ctime - c2.ctime)
}

export { addComment, editComment, removeComment, findCommentsForPath }
