const a = require('./util')

export const adminService = {
  getQueue, findUsers, migrateUsers, deleteUser
}

function getQueue () {
  return fetch('/api/admin/queue', a.authGet()).then(response => a.handleJsonResponse(response))
}

function findUsers (query) {
  return fetch('/api/admin/users', a.authPostJson(query || {})).then(a.handleJsonResponse)
}

function migrateUsers (oldKey, oldIV) {
  return fetch('/api/admin/migrateUsers', a.authPostJson({ oldKey, oldIV })).then(response => a.handleJsonResponse(response))
}

function deleteUser (email) {
  return fetch('/api/admin/deleteUser', a.authPostJson({ email })).then(response => a.handleJsonResponse(response))
}
