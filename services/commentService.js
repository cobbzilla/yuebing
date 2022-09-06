const a = require('./util')

export const commentService = {
  createComment,
  editComment,
  removeComment,
  fetchCommentsForPath
}

function fetchCommentsForPath (path) {
  return path
    ? fetch(`/api/user/comments/${path}`, a.authGet()).then(response => a.handleJsonResponse(response))
    : Promise.resolve([])
}

function createComment (path, comment) {
  if (comment && comment.trim().length > 0) {
    return fetch(`/api/user/comments/${path}`, a.authPostJson(comment)).then(a.handleJsonResponse)
  }
}

function editComment (path, commentId, comment) {
  if (comment && comment.trim().length > 0) {
    return fetch(`/api/user/comments/${path}`, a.authPutJson({ id: commentId, comment })).then(a.handleJsonResponse)
  }
}

function removeComment (path, commentId) {
  return fetch(`/api/user/comments/${path}/${commentId}`, a.authDelete()).then(a.handleJsonResponse)
}
