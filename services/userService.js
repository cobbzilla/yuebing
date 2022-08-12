const auth = require('../shared/auth')
const a = require('./util')

export const userService = {
  login,
  logout,
  register,
  verify,
  requestPasswordReset,
  inviteFriends,
  update,
  delete: _delete
}

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
  // todo: invalidate the session on the server
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

function inviteFriends (emails) {
  return fetch('/api/user/inviteFriends', a.authPostJson(emails)).then(a.handleJsonResponse)
}

function update (user) {
  return fetch(`/api/user/${user.id}`, a.authPostJson(user)).then(a.handleJsonResponse)
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: a.authHeader()
  }
  return fetch(`/api/user/${id}`, requestOptions).then(a.handleJsonResponse)
}
