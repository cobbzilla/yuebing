import { authGet } from '@/services/util'

const auth = require('../shared/auth')
const a = require('./util')

export const userService = {
  browserHeaders,
  loadPublicConfig,
  login,
  logout,
  register,
  verify,
  requestPasswordReset,
  updateUser,
  deleteUser,
  inviteFriends
}

function browserHeaders () { return fetch('/api/user/headers', { method: 'POST', body: '{}' }).then(a.handleJsonResponse) }
function loadPublicConfig () { return fetch('/api/user/config', { method: 'GET' }).then(a.handleJsonResponse) }

function login (email, password) {
  return fetch('/api/user/authenticate', a.authPostJson({ email, password }))
    .then(a.handleJsonResponse)
    .then((user) => {
      if (user.token) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      return user
    })
}

function logout () {
  // sends a Set-Cookie that invalidates whatever current cookie is set
  return fetch('/api/user/logout', a.authGet()).then(a.handleJsonResponse)
}

function register (user) {
  return fetch('/api/user/register', a.authPostJson(user)).then(a.handleJsonResponse)
}

function verify (email, token, resetPasswordHash, newPassword) {
  const verification = {}
  verification[auth.VERIFY_EMAIL_PARAM] = email
  verification[auth.VERIFY_TOKEN_PARAM] = token
  if (resetPasswordHash) {
    verification[auth.VERIFY_RESET_PARAM] = resetPasswordHash
    verification[auth.VERIFY_PASSWORD_PARAM] = newPassword
  }
  return fetch('/api/user/verify', { method: 'POST', body: JSON.stringify(verification) }).then(a.handleJsonResponse)
}

function requestPasswordReset (email) {
  const body = {}
  body[auth.VERIFY_EMAIL_PARAM] = email
  return fetch('/api/user/requestPasswordReset', { method: 'POST', body: JSON.stringify(body) }).then(a.handleJsonResponse)
}

function updateUser (update) {
  return fetch('/api/user/update', a.authPostJson(update)).then(a.handleJsonResponse)
}

function deleteUser () {
  return fetch('/api/user/delete', a.authPostJson({})).then(a.handleJsonResponse)
}

function inviteFriends (emails) {
  return fetch('/api/user/inviteFriends', a.authPostJson(emails)).then(a.handleJsonResponse)
}
