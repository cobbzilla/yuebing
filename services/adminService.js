const a = require('./util')

export const adminService = {
  getQueue,
  findUsers,
  createUser,
  migrate,
  deleteUser,
  setEditor,
  findVolumes,
  findVolume,
  addVolume,
  editVolume,
  scanVolume,
  scanPath,
  setVolumeSync,
  indexVolume,
  indexPath,
  indexInfo,
  deleteVolume,
  deletePath,
  findLibraries,
  addLibrary,
  updateLibrary,
  deleteLibrary,
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

function createUser (user) {
  return fetch('/api/admin/users', a.authPutJson(user || {})).then(a.handleJsonResponse)
}

function migrate (migration) {
  return fetch('/api/admin/migrate', a.authPostJson(migration)).then(response => a.handleJsonResponse(response))
}

function deleteUser (email) {
  return fetch(`/api/admin/users/${email}`, a.authDelete()).then(response => a.handleJsonResponse(response))
}

function setEditor (email, editor) {
  return fetch(`/api/admin/users/${email}/editor`, a.authPostJson({ email, editor })).then(response => a.handleJsonResponse(response))
}

function findVolumes (query) {
  return fetch('/api/admin/volumes', a.authPostJson(query || {})).then(a.handleJsonResponse)
}

function findVolume (name) {
  return fetch(`/api/admin/volumes/${name}`, a.authGet()).then(a.handleJsonResponse)
}

function addVolume (volume) {
  return fetch('/api/admin/volumes', a.authPutJson(volume)).then(a.handleJsonResponse)
}

function editVolume (volume) {
  return fetch('/api/admin/volumes', a.authPatchJson(volume)).then(a.handleJsonResponse)
}

function scanVolume (scanConfig) {
  return fetch(`/api/admin/volumes/${scanConfig.volume}`, a.authPatchJson(scanConfig)).then(a.handleJsonResponse)
}

function scanPath (scanConfig) {
  return fetch(`/api/admin/paths/${scanConfig.volumeAndPath}/scan`, a.authPostJson(scanConfig)).then(a.handleJsonResponse)
}

function indexVolume (volume) {
  return fetch(`/api/admin/volumes/${volume}?reindex=true`, a.authPatchJson(volume)).then(a.handleJsonResponse)
}

function indexPath (volumeAndPath) {
  return fetch(`/api/admin/paths/${volumeAndPath}/index`, a.authGet()).then(a.handleJsonResponse)
}

function deletePath (volumeAndPath) {
  return fetch(`/api/admin/paths/${volumeAndPath}/delete`, a.authDelete()).then(a.handleJsonResponse)
}

function indexInfo (name) {
  return fetch(`/api/admin/volumes/${name}?reindex=true`, a.authGet()).then(a.handleJsonResponse)
}

function setVolumeSync (volume, sync) {
  return fetch(`/api/admin/volumes/${volume}?sync=${!!sync}`, a.authPatchJson(volume)).then(a.handleJsonResponse)
}

function deleteVolume (volume) {
  return fetch(`/api/admin/volumes/${volume}`, a.authDelete()).then(a.handleJsonResponse)
}

function findLibraries (query) {
  return fetch('/api/admin/libraries', a.authPostJson(query || {})).then(a.handleJsonResponse)
}

function addLibrary (library) {
  return fetch('/api/admin/libraries', a.authPutJson(library)).then(a.handleJsonResponse)
}

function updateLibrary (library) {
  return fetch('/api/admin/libraries', a.authPatchJson(library)).then(a.handleJsonResponse)
}

function deleteLibrary (libraryName) {
  return fetch(`/api/admin/libraries/${libraryName}`, a.authDelete()).then(a.handleJsonResponse)
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
