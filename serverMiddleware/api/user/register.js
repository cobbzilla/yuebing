const api = require('../../util/api')
const u = require('../../user/userUtil')

function newSessionResponse (res) {
  return (data, newUser) => {
    if (data) {
      u.startSession(newUser).then(
        user => api.okJson(user),
        (error) => {
          console.error(`startSession: error starting session: ${error}`)
          api.serverError(`Error: ${error}`)
        })
    } else {
      api.serverError('Error saving user record')
    }
  }
}

export default {
  path: '/api/user/register',
  handler (req, res) {
    console.log(`>>>>> API: Register ${req.url} ....`)
    req.on('data', (data) => {
      const regRequest = JSON.parse(data.toString())
      try {
        u.registerUser(regRequest, newSessionResponse(res))
      } catch (e) {
        if (e instanceof u.UserValidationException) {
          api.validationFailed(e.errors)
        } else {
          console.error(`>>>>> API: Register: error reading user record: ${e}`)
          api.serverError(`Error: ${e}`)
        }
      }
    })
  }
}
