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
const SESSION_EXPIRATION = nuxt.default.privateRuntimeConfig.session.expiration

const ADMIN = nuxt.default.privateRuntimeConfig.admin
const ADMIN_USER = ADMIN.user && ADMIN.user.username && ADMIN.user.password
  ? nuxt.default.privateRuntimeConfig.admin.user
  : null

async function startSession (user) {
  delete user.password
  delete user.hashedPassword
  user.session = uuid.v4() + '.' + Math.floor(Math.random() * 1000000)
  if (ADMIN_USER && user.username === ADMIN_USER) {
    user.admin = true
  }
  await redis.set(user.session, JSON.stringify(user), SESSION_EXPIRATION)
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

// adapted from https://stackoverflow.com/a/27724419
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

function registerInitialAdminUser (regRequest) {
  return _registerUser(regRequest, () => {
    console.log(`registerInitialAdminUser: successfully registered new admin user: ${regRequest.username}`)
  }, true)
}

function registerUser (regRequest, successHandler) {
  return _registerUser(regRequest, successHandler, false)
}

function _registerUser (regRequest, successHandler, admin) {
  if (!ADMIN.allowRegistration && !admin) {
    throw new UserValidationException({ username: ['registrationNotAllowed'] })
  }
  if (!admin) {
    const errors = validateUser(regRequest)
    if (Object.keys(errors).length > 0) {
      throw new UserValidationException(errors)
    }
  } else if (admin && ADMIN.overwrite) {
    // allow over-write of initial admin when nuxt config flag is set
    writeUserRecord(regRequest, successHandler)
  } else {
    // check for duplicate user
    userExists(regRequest.username).then((exists) => {
      if (exists) {
        throw new UserValidationException({ username: ['alreadyRegistered'] })
      } else {
        writeUserRecord(regRequest)
      }
    })
  }
}

function writeUserRecord (user, successHandler) {
  // bcrypt the password, create new user object
  const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS)
  const newUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    hashedPassword: bcrypt.hashSync(user.password, salt)
  }
  const bucketParams = {
    Key: userKey(user.username),
    Body: crypt.encrypt(JSON.stringify(newUser))
  }
  s3util.putObject(bucketParams).then(
    data => successHandler(data, newUser),
    (error) => {
      console.error(`writeUserRecord: Error writing user file: ${error}`)
    })
}

async function deleteUser (username) {
  return await s3util.deleteDestObject(userKey(username))
}

// initialize admin user
if (ADMIN_USER) {
  registerInitialAdminUser(ADMIN_USER)
} else {
  console.log('userUtil: no admin user defined, not creating')
}

export {
  userKey, startSession,
  UserValidationException, registerUser,
  deleteUser
}
