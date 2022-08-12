const s3util = require('../../s3/s3util')
const crypt = require('../../util/crypt')
const api = require('../../util/api')
const u = require('../../user/userUtil')

export default {
  path: '/api/user/authenticate',
  handler (req, res) {
    console.log(`>>>>> API: Authenticate ${req.url} ....`)
    req.on('data', (data) => {
      const loginRequest = JSON.parse(data.toString())
      if (typeof loginRequest.email === 'string' && loginRequest.email.length > 1) {
        u.findUser(loginRequest.email).then(
          (user) => {
            u.checkPassword(user, loginRequest.password, (ok) => {
              if (ok) {
                u.startSession(user).then(
                  (sessionUser) => {
                    if (u.isAdmin(sessionUser)) {
                      sessionUser.admin = true
                    }
                    api.okJson(res, sessionUser)
                  },
                  (error) => {
                    console.error(`>>>>> API: Authenticate: error starting session: ${error}`)
                    api.serverError(res, `Error: ${error}`)
                  })
              } else {
                console.log(`>>>>> API: Authenticate: wrong password (ok was ${ok})`)
                return api.notFound(res)
              }
            },
            (err) => {
              console.log(`>>>>> API: Authenticate: wrong password: (err was ${err})`)
              return api.notFound(res)
            })
          },
          (error) => {
            console.error(`>>>>> API: Authenticate: error reading user record: ${error}`)
            return api.notFound(res)
          }
        )
      }
    })
  }
}
