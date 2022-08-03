export const s3Service = {
  listS3, metadata
}

function handleResponse (response) {
  console.log('>>>>>>> handleResponse: received: ' + JSON.stringify(response))
  return response.text().then((text) => {
    const data = typeof text === 'string' ? JSON.parse(text) : 'null'
    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    return data
  })
}

function listS3 (prefix) {
  return fetch(`/s3/list/${prefix}`, { method: 'GET' }).then(response => handleResponse(response))
}

function metadata (path) {
  return fetch(`/s3/meta/${path}`, { method: 'GET' }).then(response => handleResponse(response))
}
