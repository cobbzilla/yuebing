const a = require('./util')

export const s3Service = {
  listS3, metadata, jsonAsset
}

function listS3 (prefix) {
  return fetch(`/api/s3/list/${prefix}`, a.authGet()).then(a.handleJsonResponse)
}

function metadata (path) {
  return fetch(`/api/s3/meta/${path}`, a.authGet()).then(a.handleJsonResponse)
}

function jsonAsset (path) {
  return fetch(`/api/s3/proxy/${path}`, a.authGet()).then(a.handleJsonResponse)
}
