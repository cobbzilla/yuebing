const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const shasum = require('shasum')
const redis = require('../util/redis')
const nuxt = require('../../nuxt.config')
const validate = require('../util/validation')
const crypt = require('../util/crypt')
const s3util = require('../s3/s3util')

const USER_STORE_PREFIX = 'users/'
const BCRYPT_ROUNDS = nuxt.default.privateRuntimeConfig.userEncryption.bcryptRounds

async function startSession (user) {
  delete user.password
  delete user.hashedPassword
  user.session = uuid.v4() + '.' + Math.floor(Math.random() * 1000000)
  await redis.set(user.session, JSON.stringify(user), nuxt.default.privateRuntimeConfig.session.expiration)
  return user
}

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

function UserValidationException (errors) {
  this.errors = errors
  this.message = `Error: ${JSON.stringify(errors, null, 2)}`
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
}

function sanitizeUsername (username) {
  return username.replace(/[\W_.-]+/g, ' ')
}

function userKey (username) {
  return USER_STORE_PREFIX + shasum(nuxt.default.privateRuntimeConfig.userEncryption.key + ':' + sanitizeUsername(username))
}

async function userExists (username) {
  const head = await s3util.headDestObject(userKey(username))
  return head && head.ContentLength && head.ContentLength > 0
}

function registerUser (regRequest, successHandler) {
  const errors = validateUser(regRequest)
  if (Object.keys(errors).length > 0) {
    throw new UserValidationException(errors)
  }
  // check for duplicate user
  userExists(regRequest.username).then((exists) => {
    if (exists) {
      throw new UserValidationException({ username: ['alreadyRegistered'] })
    } else {
      // bcrypt the password, create new user object
      const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS)
      const newUser = {
        firstName: regRequest.firstName,
        lastName: regRequest.lastName,
        username: regRequest.username,
        hashedPassword: bcrypt.hashSync(regRequest.password, salt)
      }

      const bucketParams = {
        Key: userKey(regRequest.username),
        Body: crypt.encrypt(JSON.stringify(newUser))
      }
      s3util.putObject(bucketParams).then(
        data => successHandler(data, newUser),
        (error) => {
          console.error(`>>>>> API: Register: Error writing user file: ${error}`)
        })
    }
  })
}

// initialize admin user
const admin = nuxt.default.privateRuntimeConfig.admin
if (admin && admin.user && admin.user.username && admin.user.password) {
  const adminUser = admin.user
  userExists(adminUser.username).then(
    (exists) => {
      if (exists) {
        if (admin.overwrite) {
          console.log(`register.js: registering (overwriting) admin user: ${adminUser.username}`)
          registerUser(adminUser, () => {
            console.log(`register.js: successfully overwrote admin user: ${adminUser.username}`)
          })
        }
        console.log(`register.js: admin user already registered: ${adminUser.username}`)
      } else {
        console.log(`register.js: registering admin user: ${adminUser.username}`)
        registerUser(adminUser, () => {
          console.log(`register.js: successfully registered new admin user: ${adminUser.username}`)
        })
      }
    })
} else {
  console.log('register: no admin user defined, not creating')
}

export { userKey, startSession, validateUser, UserValidationException, registerUser }
