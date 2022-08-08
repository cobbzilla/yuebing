const a = require('./util')

export const s3Service = {
  listS3, metadata, jsonAsset
}

function listS3 (prefix) {
  return fetch(`/s3/list/${prefix}`, a.GET).then(response => a.handleJsonResponse(response))
}

function metadata (path) {
  return fetch(`/s3/meta/${path}`, a.GET).then(response => a.handleJsonResponse(response))
}

function jsonAsset (path) {
  return fetch(`/s3/proxy/${path}`, a.GET).then(response => a.handleJsonResponse(response))
}
