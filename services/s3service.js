const a = require('./util')

export const s3Service = {
  listS3, metadata, jsonAsset, fetchUserMediaInfo, updateMediaInfo
}

function listS3 (path) {
  return fetch(`/api/s3/list/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function metadata (path) {
  return fetch(`/api/s3/meta/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function jsonAsset (path) {
  return fetch(`/api/s3/proxy/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function fetchUserMediaInfo (path, values) {
  return fetch(`/api/s3/mediainfo/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function updateMediaInfo (path, values) {
  return fetch(`/api/s3/mediainfo/${path}`, a.authPostJson(values)).then(a.handleJsonResponse)
}
