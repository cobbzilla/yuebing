import { USER_SESSION_HEADER } from '@/shared'

const USER_LOCAL_STORAGE_KEY = 'user'

const UI_CONFIG = {
  snackbarErrorTimeout: 6000,
  snackbarSuccessTimeout: 6000
}

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

function authGet (headers = null) { return authReq('GET', headers) }
function authDelete (headers = null) { return authReq('DELETE', headers) }

function authReq (method, headers = null) {
  return {
    method,
    headers: headers ? Object.assign({}, headers, authHeader()) : authHeader()
  }
}

function authPostJson (obj, headers = null) { return authDataJson(obj, 'POST', headers) }
function authPutJson (obj, headers = null) { return authDataJson(obj, 'PUT', headers) }

function authDataJson (obj, method, headers = null) {
  return {
    method,
    headers: headers
      ? Object.assign({}, headers, authHeader(), { 'Content-Type': 'application/json' })
      : authHeader(),
    body: JSON.stringify(obj)
  }
}

function handleJsonResponse (response) {
  return response.text().then((text) => {
    let data
    try {
      data = typeof text === 'string' ? JSON.parse(text) : null
    } catch (e) {
      console.log(`handleJsonResponse: error parsing: ${text}`)
      data = null
    }
    if (!response.ok) {
      const error = data || (text || response.statusText)
      return Promise.reject(error)
    }
    // console.log(`handleJsonResponse returning: ${JSON.stringify(data, null, 2)}`)
    return data
  })
}

export {
  USER_LOCAL_STORAGE_KEY, UI_CONFIG,
  currentUser, authHeader, handleJsonResponse,
  authGet, authPostJson, authPutJson, authDelete
}
