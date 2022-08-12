const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const shasum = require('shasum')
const redis = require('../util/redis')
const nuxt = require('../../nuxt.config').default
const shared = require('../../shared')
const auth = require('../../shared/auth')
const loc = require('../../shared/locale')
const validate = require('../util/validation')
const crypt = require('../util/crypt')
const s3util = require('../s3/s3util')
const api = require('../util/api')
const email = require('../util/email')

const BCRYPT_ROUNDS = nuxt.privateRuntimeConfig.userEncryption.bcryptRounds
const USER_ENC_KEY = nuxt.privateRuntimeConfig.userEncryption.key
const SESSION_EXPIRATION = nuxt.privateRuntimeConfig.session.expiration

const ADMIN = nuxt.privateRuntimeConfig.admin
const ADMIN_USER = ADMIN.user && ADMIN.user.email && ADMIN.user.password ? ADMIN.user : null

const ALLOW_REGISTRATION = nuxt.publicRuntimeConfig.allowRegistration
const PUBLIC = nuxt.publicRuntimeConfig.public

function userStorePrefix (key = USER_ENC_KEY) {
  return `users_${shasum(`users:${key}`)}/`
}

// initialize LIMIT_REGISTRATION if needed
function initLimitRegistration () {
  const LIMIT_REG = nuxt.publicRuntimeConfig.limitRegistration
  if (!LIMIT_REG) {
    return Promise.resolve(null)
  }
  if (Array.isArray(LIMIT_REG)) {
    if (LIMIT_REG.length > 0 && (typeof LIMIT_REG[0] === 'string')) {
      // use as-is, it should be an array of email addresses
      return Promise.resolve(LIMIT_REG)
    } else {
      throw new TypeError(`initLimitRegistration: invalid nuxt.publicRuntimeConfig.limitRegistration: expected string or array of strings, found: ${JSON.stringify(LIMIT_REG)}`)
    }
  } else if (typeof LIMIT_REG === 'string') {
    return s3util.readDestTextObject(LIMIT_REG).then((text) => {
      if (text.trim().startsWith('[')) {
        const list = JSON.parse(text)
        if (list.length === 0 || typeof list[0] !== 'string') {
          throw new TypeError(`initLimitRegistration: invalid nuxt.publicRuntimeConfig.limitRegistration: expected dest object to contain JSON array of list of new-line separated emails, found: ${text}`)
        }
        return list
      } else {
        return text.split('\n').map(email => email.trim())
      }
    })
  } else {
    throw new TypeError(`initLimitRegistration: invalid nuxt.publicRuntimeConfig.limitRegistration: expected string or array of strings, found: ${JSON.stringify(LIMIT_REG)}`)
  }
}

let LIMIT_REGISTRATION = null
initLimitRegistration().then((list) => { LIMIT_REGISTRATION = list }, (err) => { throw err })
if (LIMIT_REGISTRATION) {
  console.log(`****** userUtil: initialized LIMIT_REGISTRATION=${JSON.stringify(LIMIT_REGISTRATION)}`)
}

function isAdmin (userOrEmail) {
  return ADMIN_USER && ADMIN_USER.email &&
    (typeof userOrEmail === 'object' && userOrEmail.email
      ? userOrEmail.email === ADMIN_USER.email
      : userOrEmail === ADMIN_USER.email)
}

async function startSession (user) {
  delete user.password
  delete user.hashedPassword
  user.session = uuid.v4() + '.' + Math.floor(Math.random() * 1000000)
  await redis.set(REDIS_SESSION_PREFIX + user.session, JSON.stringify(user), SESSION_EXPIRATION)
  return user
}

const SESSION_HEADER = shared.USER_SESSION_HEADER
const SESSION_PARAM = shared.USER_SESSION_QUERY_PARAM
const REDIS_SESSION_PREFIX = 'session_'

async function currentUser (req) {
  let session = null
  if (req.headers && req.headers[SESSION_HEADER]) {
    session = req.headers[SESSION_HEADER]
  } else if (req.url.includes('?')) {
    const query = new URLSearchParams(req.url.substring(req.url.indexOf('?')))
    session = query && query.has(SESSION_PARAM) ? query.get(SESSION_PARAM) : null
  }
  if (!session) {
    return null
  }
  try {
    const val = await redis.get(REDIS_SESSION_PREFIX + session)
    return val ? JSON.parse(val) : null
  } catch (e) {
    console.log(`currentUser: error ${e}`)
    return null
  }
}

async function requireLoggedInUser (req, res) {
  const user = await currentUser(req)
  if (user) {
    return user
  }
  return api.forbidden(res)
}

async function requireUser (req, res) {
  const user = await currentUser(req)
  if (user) {
    return user
  }
  if (PUBLIC) {
    return { email: '~anonymous~' }
  } else {
    return api.forbidden(res)
  }
}

async function requireAdmin (req, res) {
  const user = await currentUser(req)
  if (user && isAdmin(user)) {
    return user
  }
  return api.forbidden(res)
}

const USER_VALIDATIONS = {
  email: {
    required: true,
    min: 2,
    max: 100,
    regex: /^[A-Z\d][A-Z\d._%+-]*@[A-Z\d.-]+\.[A-Z]{2,6}$/i
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

function userKey (email) {
  return userStorePrefix() + shasum(USER_ENC_KEY + ':' + email.trim())
}

async function userExists (email) {
  const head = await s3util.headDestObject(userKey(email))
  return head && head.ContentLength && head.ContentLength > 0
}

function registerInitialAdminUser (regRequest) {
  return _registerUser(regRequest, () => {
    console.log(`registerInitialAdminUser: successfully registered new admin user: ${regRequest.email}`)
  }, true)
}

function registerUser (regRequest, successHandler) {
  return _registerUser(regRequest, successHandler, false)
}

function regNotAllowed () {
  return new UserValidationException({ email: ['registrationNotAllowed'] })
}

function _registerUser (regRequest, successHandler, admin) {
  if (!admin) {
    if (LIMIT_REGISTRATION && !LIMIT_REGISTRATION.includes(regRequest.email)) {
      throw regNotAllowed()
    } else if (!LIMIT_REGISTRATION && !ALLOW_REGISTRATION) {
      throw regNotAllowed()
    }
    const errors = validateUser(regRequest)
    if (Object.keys(errors).length > 0) {
      throw new UserValidationException(errors)
    }
  } else if (admin && ADMIN.overwrite) {
    // allow over-write of initial admin when nuxt config flag is set
    return createUserRecord(regRequest, successHandler)
  }
  // check for duplicate user
  return userExists(regRequest.email).then((exists) => {
    if (exists) {
      if (admin) {
        console.log(`admin user already exists: ${regRequest.email}`)
      } else {
        return Promise.resolve(() => {
          throw new UserValidationException({ email: ['alreadyRegistered'] })
        })
      }
    } else {
      return createUserRecord(regRequest, successHandler)
    }
  })
}

const USER_VERIFY_PREFIX = 'verify_token_'
const USER_VERIFY_EXPIRATION = nuxt.publicRuntimeConfig.timeout.verify || 1000 * 60 * 60 * 24 // 1 day

const USER_RESET_PASSWORD_PREFIX = 'resetPassword_token_'
const USER_RESET_PASSWORD_EXPIRATION = nuxt.publicRuntimeConfig.timeout.resetPassword || 1000 * 60 * 60 // 1 hour

function verificationKey (email) {
  return USER_VERIFY_PREFIX + shasum(USER_VERIFY_PREFIX + email)
}

function resetPasswordKey (email) {
  return USER_RESET_PASSWORD_PREFIX + shasum(USER_RESET_PASSWORD_PREFIX + email)
}

async function isCorrectVerifyToken (email, token) {
  return await isCorrectToken(email, token, verificationKey(email))
}

async function isCorrectResetPasswordToken (email, token) {
  return await isCorrectToken(email, token, resetPasswordKey(email))
}

async function isCorrectToken (email, token, key) {
  try {
    const redisToken = await redis.get(key)
    const correct = redisToken === token
    if (correct) {
      await redis.del(key)
    }
    return correct
  } catch (e) {
    console.log(`isCorrectToken: error reading from redis: ${e}`)
  }
}

function checkPassword (user, password, successCallback, errorCallback) {
  bcrypt.compare(password, user.hashedPassword).then(
    ok => successCallback(ok),
    err => errorCallback(err)
  )
}

function createUserRecord (user, successHandler) {
  // bcrypt the password, create new user object
  const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS)
  const newUser = {
    ctime: Date.now(),
    mtime: Date.now(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    locale: user.locale,
    hashedPassword: bcrypt.hashSync(user.password, salt),
    verified: isAdmin(user) ? Date.now() : null
  }
  if (!newUser.verified) {
    const token = '' + Math.floor(Math.random() * 1000000)
    const key = verificationKey(user.email)
    redis.set(key, token, USER_VERIFY_EXPIRATION).then(() => {
      console.log(`createUserRecord: created verification token for user: ${user.email}: ${key}`)
    })
    const ctx = {
      user,
      token,
      verifyUrl: nuxt.publicRuntimeConfig.siteUrl + auth.VERIFY_ENDPOINT +
        '?' + auth.VERIFY_EMAIL_PARAM + '=' + encodeURIComponent(user.email) +
        '&' + auth.VERIFY_TOKEN_PARAM + '=' + encodeURIComponent(token)
    }
    email.sendEmail(user.email, user.locale || loc.DEFAULT_LOCALE, email.TEMPLATE_VERIFY_EMAIL, ctx).then(
      (ok) => {
        console.log(`createUserRecord: verification request sent to user: ${user.email}`)
      },
      (err) => {
        console.error(`createUserRecord: ERROR sending verification request to user: ${user.email}: ${err}`)
      }
    )
  }
  const bucketParams = {
    Key: userKey(user.email),
    Body: crypt.encrypt(JSON.stringify(newUser))
  }
  s3util.putObject(bucketParams).then(
    data => successHandler(data, newUser),
    (error) => {
      console.error(`createUserRecord: Error writing user file: ${error}`)
    })
}

function updateUserRecord (user, successHandler) {
  const errors = validateUser(user)
  if (Object.keys(errors).length > 0) {
    throw new UserValidationException(errors)
  }
  // copy user object, assign mtime and delete the plaintext password and admin properties
  const update = Object.assign({}, user, { mtime: Date.now() })
  if (update.password) {
    delete update.password
  }
  // never store the 'admin' property -- we always call isAdmin to check if a user is admin
  if (update.admin) {
    delete update.admin
  }
  const bucketParams = {
    Key: userKey(user.email),
    Body: crypt.encrypt(JSON.stringify(update))
  }
  s3util.putObject(bucketParams).then(
    data => successHandler(data, update),
    (error) => {
      console.error(`updateUserRecord: Error writing user file: ${error}`)
    })
}

function resetShasum (email, token) { return shasum(email + ' ~ ' + token) }

function sendResetPasswordMessage (user) {
  const token = '' + Math.floor(Math.random() * 1000000)
  const key = resetPasswordKey(user.email)
  redis.set(key, token, USER_RESET_PASSWORD_EXPIRATION).then(() => {
    console.log(`resetPassword: created password reset token for user: ${user.email}: ${key}`)
  })
  const ctx = {
    user,
    token,
    resetPasswordUrl: nuxt.publicRuntimeConfig.siteUrl + auth.VERIFY_ENDPOINT +
      '?' + auth.VERIFY_EMAIL_PARAM + '=' + encodeURIComponent(user.email) +
      '&' + auth.VERIFY_TOKEN_PARAM + '=' + encodeURIComponent(token) +
      '&' + auth.VERIFY_RESET_PARAM + '=' + resetShasum(user.email, token)
  }
  email.sendEmail(user.email, user.locale || loc.DEFAULT_LOCALE, email.TEMPLATE_RESET_PASSWORD, ctx).then(
    (ok) => {
      console.log(`resetPassword: message sent to user: ${user.email}`)
    },
    (err) => {
      console.error(`resetPassword: ERROR sending to user: ${user.email}: ${err}`)
    }
  )
}

async function findUser (email) {
  return JSON.parse(crypt.decrypt(await s3util.readDestTextObject(userKey(email))))
}

async function deleteUser (email) {
  return await s3util.deleteDestObject(userKey(email))
}

// initialize admin user
if (ADMIN_USER) {
  registerInitialAdminUser(ADMIN_USER)
} else {
  console.log('userUtil: no admin user defined, not creating')
}

export {
  userStorePrefix, userKey, startSession, currentUser,
  checkPassword, isCorrectVerifyToken, isCorrectResetPasswordToken,
  isAdmin, requireUser, requireLoggedInUser, requireAdmin,
  UserValidationException, registerUser, resetShasum, sendResetPasswordMessage,
  findUser, validateUser, createUserRecord, updateUserRecord, deleteUser
}
