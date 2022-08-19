const a = require('./util')

export const adminService = {
  getQueue,
  findUsers,
  migrateUsers,
  deleteUser,
  findSources,
  findSource,
  addSource,
  deleteSource
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

function findSources (query) {
  return fetch('/api/admin/sources', a.authPostJson(query || {})).then(a.handleJsonResponse)
}

function findSource (name) {
  return fetch(`/api/admin/sources/${name}`, a.authGet()).then(a.handleJsonResponse)
}

function addSource (source) {
  return fetch('/api/admin/sources', a.authPutJson(source)).then(a.handleJsonResponse)
}

function deleteSource (source) {
  return fetch(`/api/admin/sources/${source}`, a.authDelete()).then(a.handleJsonResponse)
}
