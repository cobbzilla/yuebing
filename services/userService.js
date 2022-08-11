const a = require('./util')

export const userService = {
  login,
  logout,
  register,
  verify,
  getAll,
  getById,
  update,
  delete: _delete
}

function login (email, password) {
  return fetch('/api/user/authenticate', a.authPostJson({ email, password }))
    .then(a.handleJsonResponse)
    .then((user) => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
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

function verify (email, token) {
  return fetch('/api/user/verify', a.authPostJson({ email, token })).then(a.handleJsonResponse)
}

function getAll () {
  return fetch('/api/users', a.authGet()).then(a.handleJsonResponse)
}

function getById (id) {
  return fetch(`/api/user/${id}`, a.authGet()).then(a.handleJsonResponse)
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
