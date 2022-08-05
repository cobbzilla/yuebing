const bcrypt = require('bcryptjs')
const s3util = require('../s3/s3util')
const crypt = require('../util/crypt')
const u = require('./util')

export default {
  path: '/user/authenticate',
  handler (req, res) {
    console.log(`>>>>> API: Authenticate ${req.url} ....`)
    req.on('data', (data) => {
      const loginRequest = JSON.parse(data.toString())
      if (typeof loginRequest.username === 'string' && loginRequest.username.length > 1) {
        s3util.readDestTextObject(u.userKey(loginRequest.username)).then(
          (userJson) => {
            if (typeof userJson !== 'string') {
              res.statusCode = 404
              res.end('')
            } else {
              const user = JSON.parse(crypt.decrypt(userJson))
              bcrypt.compare(loginRequest.password, user.hashedPassword).then(
                (ok) => {
                  if (ok) {
                    u.startSession(user).then(
                      (u) => {
                        res.statusCode = 200
                        res.end(JSON.stringify(u))
                      },
                      (error) => {
                        console.error(`>>>>> API: Authenticate: error starting session: ${error}`)
                        res.statusCode = 500
                        res.end(`Error: ${error}`)
                      })
                  } else {
                    console.log(`>>>>> API: Authenticate: wrong password (ok was ${ok})`)
                    res.statsCode = 403
                    res.end()
                  }
                },
                (err) => {
                  console.log(`>>>>> API: Authenticate: wrong password: (err was ${err})`)
                  res.statsCode = 403
                  res.end()
                })
            }
          },
          (error) => {
            console.error(`>>>>> API: Authenticate: error reading user record: ${error}`)
            res.statusCode = 500
            res.end(`Error: ${error}`)
          }
        )
      }
    })
  }
}
