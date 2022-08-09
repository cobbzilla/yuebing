const u = require('../../user/userUtil')

function newSessionResponse (res) {
  return (data, newUser) => {
    if (data) {
      u.startSession(newUser).then(
        (u) => {
          res.statusCode = 200
          res.end(JSON.stringify(u))
        },
        (error) => {
          console.error(`startSession: error starting session: ${error}`)
          res.statusCode = 500
          res.end(`Error: ${error}`)
        })
    } else {
      res.statusCode = 500
      res.end('Error saving user record')
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
          res.statusCode = 422
          console.log(`>>>>> API: Register: returning validation errors: ${JSON.stringify(e.errors, null, 2)}`)
          res.end(JSON.stringify(e.errors))
        } else {
          console.error(`>>>>> API: Register: error reading user record: ${e}`)
          res.statusCode = 500
          res.end(`Error: ${e}`)
        }
      }
    })
  }
}
