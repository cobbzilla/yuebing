import { USER_SESSION_HEADER } from '@/shared'

const USER_LOCAL_STORAGE_KEY = 'user'

function currentUser () {
  const userJson = localStorage.getItem(USER_LOCAL_STORAGE_KEY)
  try {
    return userJson ? JSON.parse(userJson) : null
  } catch (e) {
    console.log(`currentUser: error parsing userJson: ${userJson}: ${e}`)
  }
}

function authHeader () {
  const user = currentUser()
  if (user && user.session) {
    const headers = {}
    headers[USER_SESSION_HEADER] = user.session
    return headers
  } else {
    return {}
  }
}

function authGet (headers = null) {
  return {
    method: 'GET',
    headers: headers ? Object.assign({}, headers, authHeader()) : authHeader()
  }
}

function authPostJson (obj, headers = null) {
  return {
    method: 'POST',
    headers: headers
      ? Object.assign({}, headers, authHeader(), { 'Content-Type': 'application/json' })
      : authHeader(),
    body: JSON.stringify(obj)
  }
}

function handleJsonResponse (response) {
  return response.text().then((text) => {
    const data = typeof text === 'string' ? JSON.parse(text) : 'null'
    if (!response.ok) {
      const error = text ? data : response.statusText
      return Promise.reject(error)
    }
    // console.log(`handleJsonResponse returning: ${JSON.stringify(data, null, 2)}`)
    return data
  })
}

export {
  USER_LOCAL_STORAGE_KEY,
  currentUser, authHeader, authGet, authPostJson, handleJsonResponse
}
