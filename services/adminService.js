const a = require('./util')

export const adminService = {
  getQueue,
  findUsers,
  migrate,
  deleteUser,
  findSources,
  findSource,
  addSource,
  scanSource,
  scanPath,
  indexSource,
  indexPath,
  indexInfo,
  deleteSource,
  deletePath,
  loadSiteConfig,
  updateSiteConfig,
  buildSearchIndex
}

function getQueue () {
  return fetch('/api/admin/queue', a.authGet()).then(response => a.handleJsonResponse(response))
}

function findUsers (query) {
  return fetch('/api/admin/users', a.authPostJson(query || {})).then(a.handleJsonResponse)
}

function migrate (migration) {
  return fetch('/api/admin/migrate', a.authPostJson(migration)).then(response => a.handleJsonResponse(response))
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

function scanSource (source) {
  return fetch(`/api/admin/sources/${source}`, a.authPatchJson(source)).then(a.handleJsonResponse)
}

function scanPath (sourceAndPath) {
  return fetch(`/api/admin/paths/${sourceAndPath}/scan`, a.authGet()).then(a.handleJsonResponse)
}

function indexSource (source) {
  return fetch(`/api/admin/sources/${source}?reindex=true`, a.authPatchJson(source)).then(a.handleJsonResponse)
}

function indexPath (sourceAndPath) {
  return fetch(`/api/admin/paths/${sourceAndPath}/index`, a.authGet()).then(a.handleJsonResponse)
}

function deletePath (sourceAndPath) {
  return fetch(`/api/admin/paths/${sourceAndPath}/delete`, a.authDelete()).then(a.handleJsonResponse)
}

function indexInfo (name) {
  return fetch(`/api/admin/sources/${name}?reindex=true`, a.authGet()).then(a.handleJsonResponse)
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

function buildSearchIndex () {
  return fetch('/api/admin/config', a.authPatchJson({})).then(a.handleJsonResponse)
}
