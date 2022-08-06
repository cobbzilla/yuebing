export const s3Service = {
  listS3, metadata, jsonAsset
}

function handleJsonResponse (response) {
  return response.text().then((text) => {
    const data = typeof text === 'string' ? JSON.parse(text) : 'null'
    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    // console.log(`handleJsonResponse returning: ${JSON.stringify(data, null, 2)}`)
    return data
  })
}

const GET = { method: 'GET' }

function listS3 (prefix) {
  return fetch(`/s3/list/${prefix}`, GET).then(response => handleJsonResponse(response))
}

function metadata (path) {
  return fetch(`/s3/meta/${path}`, GET).then(response => handleJsonResponse(response))
}

function jsonAsset (path) {
  return fetch(`/s3/proxy/${path}`, GET).then(response => handleJsonResponse(response))
}
