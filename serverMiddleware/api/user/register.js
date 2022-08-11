const api = require('../../util/api')
const u = require('../../user/userUtil')

function newSessionResponse (res) {
  return (data, newUser) => {
    if (data) {
      u.startSession(newUser).then(
        user => api.okJson(res, user),
        (error) => {
          console.error(`startSession: error starting session: ${error}`)
          api.serverError(res, `Error: ${error}`)
        })
    } else {
      api.serverError(res, 'Error saving user record')
    }
  }
}

function handleRegError (res, e) {
  if (e instanceof u.UserValidationException) {
    api.validationFailed(res, e.errors)
  } else {
    console.error(`>>>>> API: Register: error reading user record: ${e}`)
    api.serverError(res, `Error: ${e}`)
  }
}

export default {
  path: '/api/user/register',
  handler (req, res) {
    console.log(`>>>>> API: Register ${req.url} ....`)
    req.on('data', (data) => {
      const regRequest = JSON.parse(data.toString())
      const regResult = u.registerUser(regRequest, newSessionResponse(res))
      if (regResult instanceof Promise) {
        regResult.then((ok) => {
          if (typeof ok === 'function') {
            try {
              const isOk = ok()
              console.log(`>>>> API: Register: SUCCESS, isOk=${isOk}`)
            } catch (e) {
              return handleRegError(res, e)
            }
          }
        })
      }
    })
  }
}
