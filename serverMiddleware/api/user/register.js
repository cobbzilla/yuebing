const bcrypt = require('bcryptjs')
const nuxt = require('../../../nuxt.config')
const s3util = require('../../s3/s3util')
const validate = require('../../util/validation')
const crypt = require('../../util/crypt')
const u = require('../../user/userUtil')

const USER_VALIDATIONS = {
  username: {
    required: true,
    min: 2,
    max: 100
  },
  password: {
    required: true,
    min: 8,
    max: 100
  },
  firstName: {
    required: false,
    min: 2,
    max: 100
  },
  lastName: {
    required: false,
    min: 2,
    max: 100
  }
}

function validateUser (u) {
  return validate.validateObject(u, USER_VALIDATIONS)
}

export default {
  path: '/api/user/register',
  handler (req, res) {
    console.log(`>>>>> API: Register ${req.url} ....`)
    req.on('data', (data) => {
      const regRequest = JSON.parse(data.toString())
      const errors = validateUser(regRequest)
      if (Object.keys(errors).length > 0) {
        res.statusCode = 422
        console.log(`>>>>> API: Register: returning validation errors: ${JSON.stringify(errors, null, 2)}`)
        res.end(JSON.stringify(errors))
        return
      }

      // check for duplicate user
      const userKey = u.userKey(regRequest.username)
      s3util.headDestObject(userKey).then(
        (ok) => {
          if (ok) { // HEAD succeeded, so user already exists
            res.statusCode = 422
            res.end(JSON.stringify({ username: ['alreadyRegistered'] }))
            return
          }

          // bcrypt the password, create new user object
          const salt = bcrypt.genSaltSync(nuxt.default.privateRuntimeConfig.userEncryption.bcryptRounds)
          const newUser = {
            firstName: regRequest.firstName,
            lastName: regRequest.lastName,
            username: regRequest.username,
            hashedPassword: bcrypt.hashSync(regRequest.password, salt)
          }

          const bucketParams = { Key: userKey, Body: crypt.encrypt(JSON.stringify(newUser)) }
          s3util.putObject(bucketParams).then(
            (data) => {
              if (data) {
                u.startSession(newUser).then(
                  (u) => {
                    res.statusCode = 200
                    res.end(JSON.stringify(u))
                  },
                  (error) => {
                    console.error(`>>>>> API: Register: error starting session: ${error}`)
                    res.statusCode = 500
                    res.end(`Error: ${error}`)
                  })
              } else {
                res.statusCode = 500
                res.end('Error saving user record')
              }
            },
            (error) => {
              console.error(`>>>>> API: Register: Error writing user file: ${userKey}: ${error}`)
            }
          )
        },
        (error) => {
          console.error(`>>>>> API: Register: error reading user record: ${error}`)
          res.statusCode = 500
          res.end(`Error: ${error}`)
        })
    })
  }
}
