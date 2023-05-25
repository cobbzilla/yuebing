const shared = require('../shared')
const { NO_CACHE_HEADER } = require('../shared')
const a = require('./util')

export const volumeService = {
  listObjects,
  searchContent,
  metadata,
  jsonAsset,
  fetchUserMediaInfo,
  updateUserMediaInfo,
  fetchSelectedThumbnail,
  updateSelectedThumbnail
}

function listObjects (path, noCache = null) {
  const headers = []
  if (noCache === true) {
    headers[NO_CACHE_HEADER] = 'true'
  }
  return fetch(`/api/source/list/${path}`, a.authGet(headers)).then(a.handleJsonResponse)
}

function searchContent (query) {
  return fetch('/api/source/list', a.authPostJson(query)).then(a.handleJsonResponse)
}

function metadata (path) {
  return fetch(`/api/source/meta/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function jsonAsset (path) {
  return fetch(`${shared.STREAM_API}/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function fetchUserMediaInfo (path) {
  return fetch(`/api/source/mediainfo/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function updateUserMediaInfo (path, values) {
  return fetch(`/api/source/mediainfo/${path}`, a.authPostJson(values)).then(a.handleJsonResponse)
}

function fetchSelectedThumbnail (path) {
  return fetch(`/api/source/thumbnail/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function updateSelectedThumbnail (path, thumb) {
  return fetch(`/api/source/thumbnail/${path}`, a.authPostJson(thumb)).then(a.handleJsonResponse)
}
