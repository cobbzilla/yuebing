const GET = { method: 'GET' }

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

export {
  GET,
  handleJsonResponse
}
