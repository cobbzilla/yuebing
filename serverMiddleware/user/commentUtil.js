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
    author: user.username,
    path
  }
  const commentJson = JSON.stringify(commentObject)
  await redis.sadd(commentCacheKeyForPath(path), commentJson)
  await system.api.writeFile(pathToSingleComment(path, newId), commentJson)
  await system.api.writeFile(userCommentReferencePath(user, newId), '~')
  logger.info(`addComment(${path}): added comment: ${commentJson}`)
  return commentObject
}

let ADMIN_USERNAME = null
const adminUsername = () => {
  if (ADMIN_USERNAME === null) {
    ADMIN_USERNAME = system.privateConfig.admin.user.username
  }
  return ADMIN_USERNAME
}

const isAdmin = user => user && user.username === adminUsername()
const isEditor = user => user && user.editor === true

const editComment = async (user, path, commentId, comment) => {
  const updatePath = pathToSingleComment(path, commentId)
  const existingCommentJson = await system.api.safeReadFile(updatePath)
  if (!existingCommentJson) {
    logger.warn(`editComment(${path}, ${commentId}): comment not found`)
    return null
  }
  const existingComment = JSON.parse(existingCommentJson)
  if (existingComment.author !== user.username && !isAdmin(user) && !isEditor(user)) {
    logger.warn(`editComment(${path}, ${commentId}): user ${user.username} cannot edit comment by existingComment.author=${existingComment.author}`)
    return null
  }
  if (existingComment.id !== commentId) {
    logger.warn(`editComment(${path}, ${commentId}): existingComment.id ${existingComment.id} within JSON object did not match file path id: ${commentId}`)
    return null
  }
  await redis.srem(commentCacheKeyForPath(path), existingCommentJson)
  const existingVersion = Object.assign({}, existingComment)
  if (existingVersion.versions) {
    delete existingVersion.versions
  }
  const updatedComment = Object.assign({}, existingVersion, { comment, mtime: Date.now() })
  updatedComment.versions = existingComment.versions || []
  updatedComment.versions.push(existingVersion)
  const updatedCommentJson = JSON.stringify(updatedComment)
  await redis.sadd(commentCacheKeyForPath(path), updatedCommentJson)
  await system.api.writeFile(updatePath, updatedCommentJson)
  logger.info(`editComment(${path}): updated comment: ${updatedCommentJson}`)
  return updatedComment
}

const removeComment = async (user, path, commentId) => {
  const updatePath = pathToSingleComment(path, commentId)
  const existingCommentJson = await system.api.safeReadFile(updatePath)
  if (!existingCommentJson) {
    logger.warn(`removeComment(${path}, ${commentId}): comment not found`)
    return null
  }
  const existingComment = JSON.parse(existingCommentJson)
  if (existingComment.id !== commentId) {
    logger.warn(`removeComment(${path}, ${commentId}): existingComment.id ${existingComment.id} within JSON object did not match file path id: ${commentId}`)
    return null
  }
  if (existingComment.author !== user.username && !isAdmin(user)) {
    logger.warn(`removeComment(${path}, ${commentId}): user ${user.username} cannot remove comment by existingComment.author=${existingComment.author}`)
    return null
  }
  await redis.srem(commentCacheKeyForPath(path), existingCommentJson)
  const commentRemoved = await system.api.remove(updatePath, { quiet: true })
  if (commentRemoved) {
    logger.info(`removeComment(${path}): removed comment for user ${user}: ${commentId}`)
  } else {
    logger.warn(`removeComment(${path}): comment NOT removed for user ${user}: ${commentId}`)
  }
  const refRemoved = await system.api.remove(userCommentReferencePath(user, commentId), { quiet: true })
  if (refRemoved) {
    logger.info(`removeComment(${path}): removed comment ref for user ${user}: ${commentId}`)
  } else {
    logger.warn(`removeComment(${path}): comment NOT removed for user ${user}: ${commentId}`)
  }
  return refRemoved
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
  const commentFiles = await system.api.safeList(commentsForPath(path), { recursive: true })
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

const deleteAllUserComments = async (username) => {
  const commentFiles = await system.api.list(commentsForUser(username), { recursive: true })
  const promises = []
  for (const commentFile of commentFiles) {
    promises.push(new Promise(async (resolve) => {
      const realCommentPath = system.api.safeReadFile(commentFile.name)
      if (realCommentPath) {
        if (!await system.api.remove(realCommentPath.trim())) {
          logger.warn(`deleteAllUserComments(${username}): error removing: ${realCommentPath}`)
        }
      }
      if (!await system.api.remove(commentFile.name)) {
        logger.warn(`deleteAllUserComments(${username}): error removing: ${commentFile.name}`)
      }
      resolve()
    }))
  }
  await Promise.all(promises)
}

const deleteAllPathComments = async (path) => {
  const commentFiles = await system.api.list(commentsForPath(path), { recursive: true })
  const promises = []
  for (const commentFile of commentFiles) {
    promises.push(new Promise(async (resolve) => {
      const commentJson = system.api.safeReadFile(commentFile.name)
      if (!commentJson) {
        logger.warn(`Error reading comment file: ${commentFile.name}`)
        return
      }
      const comment = JSON.parse(commentJson)
      const userRefComment = userCommentReferencePath(comment.author, comment.id)
      const refMeta = await system.api.safeMetadata(userRefComment)
      if (refMeta) {
        if (!await system.api.remove(userRefComment)) {
          logger.warn(`deleteAllPathComments(${path}): error removing userRefComment: ${userRefComment}`)
        }
      }
      if (!await system.api.remove(commentFile.name)) {
        logger.warn(`deleteAllPathComments(${path}): error removing: ${commentFile.name}`)
      }
      resolve()
    }))
  }
  await Promise.all(promises)
}

system.deleteUserHandlers['comments'] = async user => deleteAllUserComments(user.username)
system.deletePathHandlers['comments'] = async path => deleteAllPathComments(path)

export { addComment, editComment, removeComment, findCommentsForPath }
