const a = require('./util')

export const adminService = {
  getQueue,
  findUsers,
  migrateData,
  deleteUser,
  findSources,
  findSource,
  addSource,
  deleteSource,
  loadSiteConfig,
  updateSiteConfig
}

function getQueue () {
  return fetch('/api/admin/queue', a.authGet()).then(response => a.handleJsonResponse(response))
}

function findUsers (query) {
  return fetch('/api/admin/users', a.authPostJson(query || {})).then(a.handleJsonResponse)
}

function migrateData (oldKey, oldIV, oldAlgo) {
  return fetch('/api/admin/migrateData', a.authPostJson({ oldKey, oldIV, oldAlgo })).then(response => a.handleJsonResponse(response))
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

function loadSiteConfig () {
  return fetch('/api/admin/config', a.authGet()).then(a.handleJsonResponse)
}

function updateSiteConfig (config) {
  return fetch('/api/admin/config', a.authPostJson(config)).then(a.handleJsonResponse)
}
