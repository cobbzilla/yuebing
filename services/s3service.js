const shared = require('../shared')
const a = require('./util')

export const s3Service = {
  listS3,
  metadata,
  jsonAsset,
  fetchUserMediaInfo,
  updateUserMediaInfo,
  fetchSelectedThumbnail,
  updateSelectedThumbnail
}

function listS3 (path) {
  return fetch(`/api/s3/list/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function metadata (path) {
  return fetch(`/api/s3/meta/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function jsonAsset (path) {
  return fetch(`${shared.PROXY_API}/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function fetchUserMediaInfo (path) {
  return fetch(`/api/s3/mediainfo/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function updateUserMediaInfo (path, values) {
  return fetch(`/api/s3/mediainfo/${path}`, a.authPostJson(values)).then(a.handleJsonResponse)
}

function fetchSelectedThumbnail (path) {
  return fetch(`/api/s3/thumbnail/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function updateSelectedThumbnail (path, thumb) {
  return fetch(`/api/s3/thumbnail/${path}`, a.authPostJson(thumb)).then(a.handleJsonResponse)
}
