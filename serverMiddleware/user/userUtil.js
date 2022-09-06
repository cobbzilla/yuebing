const cookie = require('cookie')
const { MobilettoNotFoundError } = require('mobiletto')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const shasum = require('shasum')
const redis = require('../util/redis')
const c = require('../../shared')
const auth = require('../../shared/auth')
const valid = require('../../shared/validation')
const api = require('../util/api')
const email = require('../util/email')
const { queryParamValue } = require('../util/api')
const system = require('../util/config').SYSTEM
const logger = system.logger

const ADMIN = system.privateConfig.admin
const ADMIN_USER = ADMIN.user && ADMIN.user.email && ADMIN.user.password ? ADMIN.user : null
const ADMIN_USERNAME = ADMIN.user && ADMIN.user.username ? ADMIN.user.username : 'admin'
const BCRYPT_ROUNDS = system.privateConfig.encryption.bcryptRounds

const ALLOW_REGISTRATION = system.publicConfig.allowRegistration
const PUBLIC = system.publicConfig.public

const SESSION_EXPIRATION = system.privateConfig.session.expiration

// initialize LIMIT_REGISTRATION if needed
function initLimitRegistration () {
  const LIMIT_REG = system.publicConfig.limitRegistration
  if (!LIMIT_REG) {
    return Promise.resolve(null)
  }
  if (Array.isArray(LIMIT_REG)) {
    if (LIMIT_REG.length > 0 && (typeof LIMIT_REG[0] === 'string')) {
      // use as-is, it should be an array of email addresses
      return Promise.resolve(LIMIT_REG)
    } else {
      throw new TypeError(`initLimitRegistration: invalid backend.publicConfig.limitRegistration: expected string or array of strings, found: ${JSON.stringify(LIMIT_REG)}`)
    }
  } else if (typeof LIMIT_REG === 'string') {
    return system.api.readFile(LIMIT_REG).then((data) => {
      const text = data.toString()
      if (text.toString().trim().startsWith('[')) {
        const list = JSON.parse(text.toString())
        if (list.length === 0 || typeof list[0] !== 'string') {
          throw new TypeError(`initLimitRegistration: invalid backend.publicConfig.limitRegistration: expected dest object to contain JSON array of list of new-line separated emails, found: ${text}`)
        }
        return list
      } else {
        return text.split('\n').map(email => email.trim())
      }
    })
  } else {
    throw new TypeError(`initLimitRegistration: invalid backend.publicConfig.limitRegistration: expected string or array of strings, found: ${JSON.stringify(LIMIT_REG)}`)
  }
}

let LIMIT_REGISTRATION = null
initLimitRegistration().then((list) => { LIMIT_REGISTRATION = list }, (err) => { throw err })
if (LIMIT_REGISTRATION) {
  logger.info(`****** userUtil: initialized LIMIT_REGISTRATION=${JSON.stringify(LIMIT_REGISTRATION)}`)
}

function isAdmin (userOrEmail) {
  return ADMIN_USER && ADMIN_USER.email &&
    (typeof userOrEmail === 'object' && userOrEmail.email
      ? userOrEmail.email === ADMIN_USER.email
      : userOrEmail === ADMIN_USER.email)
}

function redisUserSessionSet (user) {
  return REDIS_SESSION_SET_PREFIX + shasum(user.email)
}

async function startSession (user) {
  delete user.password
  delete user.hashedPassword
  user.session = uuid.v4() + '.' + Math.floor(Math.random() * 1000000)
  const sessionKey = REDIS_SESSION_PREFIX + user.session
  const sessionSetKey = redisUserSessionSet(user)
  await redis.set(sessionKey, JSON.stringify(user), SESSION_EXPIRATION)
  await redis.sadd(sessionSetKey, sessionKey)
  await redis.expire(sessionSetKey, SESSION_EXPIRATION)
  return user
}

function newSessionResponse (res) {
  return (data, newUser) => {
    if (data) {
      startSession(newUser).then(
        (user) => {
          api.setSessionCookie(res, user.session)
          return api.okJson(res, user)
        },
        error => api.serverError(res, `Error: ${error}`))
    } else {
      return api.serverError(res, 'Error')
    }
  }
}

function cancelSessions (user) {
  const sessionSetKey = redisUserSessionSet(user)
  redis.smembers(sessionSetKey).then(async (members) => {
    for (const sessionKey of members) {
      await redis.del(sessionKey)
    }
  }).then(() => redis.del(sessionSetKey))
}

const SESSION_HEADER = c.USER_SESSION_HEADER
const SESSION_PARAM = c.USER_SESSION_QUERY_PARAM
const REDIS_SESSION_PREFIX = 'session_'
const REDIS_SESSION_SET_PREFIX = 'session_SET_'

async function currentUser (req) {
  let session = null
  if (req.headers && req.headers[SESSION_HEADER]) {
    session = req.headers[SESSION_HEADER]
  } else if (req.url.includes('?')) {
    session = queryParamValue(req, SESSION_PARAM)
  } else if (req.headers && req.headers.cookie) {
    session = cookie.parse(req.headers.cookie)[c.USER_SESSION_HEADER]
  }
  if (!session) {
    return null
  }
  try {
    const val = await redis.get(REDIS_SESSION_PREFIX + session)
    return val ? JSON.parse(val) : null
  } catch (e) {
    logger.info(`currentUser: error ${e}`)
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
  if (user && await isAdmin(user)) {
    return user
  }
  return api.forbidden(res)
}

// adapted from https://stackoverflow.com/a/27724419
function UserValidationError (errors) {
  this.errors = errors
  this.message = `Error: ${JSON.stringify(errors, null, 2)}`
  // Use V8's native method if available, otherwise fallback
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
  UserValidationError.prototype.toString = () => JSON.stringify(this)
}

const USERS_PREFIX = 'users/'
const userKey = username => USERS_PREFIX + shasum(USERS_PREFIX + username.toLowerCase().trim())

const EMAILS_PREFIX = 'emails/'
const emailKey = email => EMAILS_PREFIX + shasum(EMAILS_PREFIX + email.toLowerCase().trim())

const CACHE_PREFIX_EMAIL_EXISTS = 'emailExists_'
const CACHE_PREFIX_USERNAME_EXISTS = 'emailExists_'
const CACHE_EXPIRATION_NAME_EXISTS = 1000 * 60 * 60 * 24
const NAME_NOT_FOUND = '~'

const makeCacheable = async (cachePrefix, key, expiration, func) => {
  const fullKey = cachePrefix + key
  let val = await redis.get(fullKey)
  if (val) {
    return val.toString() === NAME_NOT_FOUND ? null : val
  }
  val = func(key)
  await redis.set(fullKey, JSON.stringify(val ? val : NAME_NOT_FOUND), expiration)
  return val ? val : null
}

const emailExists = async (email) => await makeCacheable(CACHE_PREFIX_EMAIL_EXISTS, email, CACHE_EXPIRATION_NAME_EXISTS,
    async e => await system.api.safeMetadata(emailKey(e)))

const recordRegisteredEmail = async email => await redis.set(CACHE_PREFIX_EMAIL_EXISTS+email, email, CACHE_EXPIRATION_NAME_EXISTS)

const usernameExists = async (name) => await makeCacheable(CACHE_PREFIX_USERNAME_EXISTS, name, CACHE_EXPIRATION_NAME_EXISTS,
    async n => await system.api.safeMetadata(userKey(n)))

const recordRegisterUsername = async name => redis.set(CACHE_PREFIX_USERNAME_EXISTS+name, name, CACHE_EXPIRATION_NAME_EXISTS)

async function findUser (nameOrEmail, email = null) {
  const user = await system.api.safeReadFile(userKey(nameOrEmail))
  if (user) {
    return JSON.parse(user)
  }
  const userByEmail = await system.api.safeReadFile(emailKey(email ? email : nameOrEmail))
  return userByEmail ? JSON.parse(await system.api.safeReadFile(userKey(JSON.parse(userByEmail)))) : null
}

async function registerInitialAdminUser (regRequest) {
  if (!regRequest.firstName) {
    regRequest.firstName = ADMIN_USERNAME
  }
  if (!regRequest.lastName) {
    regRequest.lastName = ADMIN_USERNAME
  }
  if (!regRequest.username) {
    regRequest.username = ADMIN_USERNAME
  }
  return await _registerUser(regRequest, () => {
    logger.info(`registerInitialAdminUser: successfully registered new admin user: ${regRequest.email}`)
  }, true)
}

async function registerUser (regRequest, successHandler) {
  return await _registerUser(regRequest, successHandler, false)
}

function regNotAllowed () {
  return new UserValidationError({ email: ['registrationNotAllowed'] })
}

const ERR_ALREADY_REGISTERED = 'alreadyRegistered'

async function _registerUser (regRequest, successHandler, admin) {
  let errors = {}
  if (!admin) {
    if (LIMIT_REGISTRATION && !LIMIT_REGISTRATION.includes(regRequest.email)) {
      throw regNotAllowed()
    } else if (!LIMIT_REGISTRATION && !ALLOW_REGISTRATION) {
      throw regNotAllowed()
    }
    errors = valid.validate(regRequest)
    if (!c.empty(errors)) {
      throw new UserValidationError(errors)
    }
  } else if (admin && ADMIN.overwrite) {
    // allow over-write of initial admin when nuxt config flag is set
    return await createUserRecord(regRequest, successHandler)
  }
  // check for duplicate user
  if (await usernameExists(regRequest.username)) {
    if (typeof errors.username === 'undefined') { errors.username = [] }
    errors.username.push(ERR_ALREADY_REGISTERED)
  }
  if (await emailExists(regRequest.email)) {
    if (typeof errors.email === 'undefined') { errors.email = [] }
    errors.email.push(ERR_ALREADY_REGISTERED)
  }
  if (c.okl(errors) > 0) {
    throw new UserValidationError(errors)
  }
  return await createUserRecord(regRequest, successHandler)
}

const USER_VERIFY_PREFIX = 'verify_token_'
const USER_VERIFY_EXPIRATION = system.publicConfig.timeout.verify || 1000 * 60 * 60 * 24 // 1 day

const USER_RESET_PASSWORD_PREFIX = 'resetPassword_token_'
const USER_RESET_PASSWORD_EXPIRATION = system.publicConfig.timeout.resetPassword || 1000 * 60 * 60 // 1 hour

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
    logger.info(`isCorrectToken: error reading from redis: ${e}`)
  }
}

function checkPassword (user, password, successCallback, errorCallback) {
  bcrypt.compare(password, user.hashedPassword).then(
    ok => successCallback(ok),
    err => errorCallback(err)
  )
}

async function createUserRecord (user, successHandler) {
  // bcrypt the password, create new user object
  const salt = bcrypt.genSaltSync(BCRYPT_ROUNDS)
  const newUser = {
    ctime: Date.now(),
    mtime: Date.now(),
    username: user.username,
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
      logger.info(`createUserRecord: created verification token for user: ${user.email}: ${key}`)
    })
    const ctx = {
      user: newUser,
      token,
      verifyUrl: c.normalizeUrl(system.publicConfig.siteUrl, auth.VERIFY_ENDPOINT) +
        '?' + auth.VERIFY_EMAIL_PARAM + '=' + encodeURIComponent(newUser.email) +
        '&' + auth.VERIFY_TOKEN_PARAM + '=' + encodeURIComponent(token)
    }
    email.sendEmail(newUser.email, newUser.locale || c.DEFAULT_LOCALE, email.TEMPLATE_VERIFY_EMAIL, ctx).then(
      () => {
        logger.info(`createUserRecord: verification request sent to user: ${newUser.email}`)
      },
      (err) => {
        logger.error(`createUserRecord: ERROR sending verification request to user: ${newUser.email}: ${err}`)
      }
    )
  }
  let success = false
  try {
    const userJson = JSON.stringify(newUser)
    const nameJson = JSON.stringify(newUser.username)
    const count = (await system.api.writeFile(userKey(newUser.username), userJson))
    if (count && await system.api.writeFile(emailKey(newUser.email), nameJson)) {
      successHandler(count, newUser)
      success = true
      return newUser
    }
  } catch (e) {
    logger.error(`createUserRecord: Error writing user files: ${e}`)
    throw e
  } finally {
    if (success) {
      // the "already registered" cache for email/username may have a stale entry that says
      // this email/username is not registered. It now is, so update those caches.
      await recordRegisteredEmail(user.email)
      await recordRegisterUsername(user.username)
    }
  }
  throw new UserValidationError(`Failed to write one or more user files, but no error occurred; username=${newUser.username}`)
}

function updateUserRecord (proposed, successHandler) {
  const errors = valid.validate(proposed, true)
  if (!c.empty(errors)) {
    throw new UserValidationError(errors)
  }

  return findUser(proposed.username, proposed.email).then(async (user) => {
    // copy user object, set mtime, delete the plaintext password and admin properties
    const update = Object.assign({}, user, proposed, { mtime: Date.now() })
    if (update.password) {
      delete update.password
    }
    // never store the 'admin' property -- we always call isAdmin to check if a user is admin
    if (update.admin) {
      delete update.admin
    }
    if (update.session) {
      // don't persist session
      delete update.session
    }
    update.username = user.username // don't allow any username changes for now
    logger.info(`updateUserRecord: updating backend with: ${JSON.stringify(update)}`)
    try {
      const count = await system.api.writeFile(userKey(user.username), JSON.stringify(update))
      if (emailKey(update.email) !== emailKey(user.email)) {
        // update email index if address changed
        await system.api.remove(emailKey(user.email))
        await system.api.writeFile(emailKey(user.email), JSON.stringify(user.username))
      }
      await successHandler(count, update)
    } catch (e) {
      logger.error(`updateUserRecord: findUser error: ${err}`)
      throw e
    }
  })
}

function resetShasum (email, token) { return shasum(email + ' ~ ' + token) }

function sendResetPasswordMessage (user) {
  const token = '' + Math.floor(Math.random() * 1000000)
  const key = resetPasswordKey(user.email)
  redis.set(key, token, USER_RESET_PASSWORD_EXPIRATION).then(() => {
    logger.info(`resetPassword: created password reset token for user: ${user.email}: ${key}`)
  })
  const ctx = {
    user,
    token,
    resetPasswordUrl: c.normalizeUrl(system.publicConfig.siteUrl, auth.VERIFY_ENDPOINT) +
      '?' + auth.VERIFY_EMAIL_PARAM + '=' + encodeURIComponent(user.email) +
      '&' + auth.VERIFY_TOKEN_PARAM + '=' + encodeURIComponent(token) +
      '&' + auth.VERIFY_RESET_PARAM + '=' + resetShasum(user.email, token)
  }
  email.sendEmail(user.email, user.locale || c.DEFAULT_LOCALE, email.TEMPLATE_RESET_PASSWORD, ctx).then(
    () => {
      logger.info(`resetPassword: message sent to user: ${user.email}`)
    },
    (err) => {
      logger.error(`resetPassword: ERROR sending to user: ${user.email}: ${err}`)
    }
  )
}

async function sendInvitations (fromUser, emailList) {
  const ctx = {
    fromUser,
    inviteLink: c.normalizeUrl(system.publicConfig.siteUrl, auth.REGISTER_ENDPOINT)
  }
  const successfulSends = {}
  const failedSends = {}

  const list = []
  for (const recipient of emailList) {
    if (!valid.isValidEmail(recipient.trim())) {
      failedSends[recipient] = 'invalid'
    } else {
      list.push(recipient.trim())
    }
  }
  // return await Promise.all(objectList.map(obj => migrateUser(obj.name, normKey, normIV)))
  await Promise.all(list.map(
    async (recipient) => {
      ctx.recipient = recipient
      try {
        const existingUser = await findUser(recipient)
        if (existingUser) {
          successfulSends[recipient] = Date.now()
          return Promise.resolve()
        }
      } catch (e) {
        // NoSuchKey is an expected exception, we are just checking to make sure the user
        // does NOT exist before sending them an invitation to join. So it's OK to get this error
        if (!(e instanceof MobilettoNotFoundError)) {
          // For other errors, we should at least log
          logger.error(`sendInvitations: unexpected findUser error: ${e}, we'll still send email to: ${recipient}`)
        }
      }
      return email.sendEmail(recipient, fromUser.locale || c.DEFAULT_LOCALE, email.TEMPLATE_INVITATION, ctx).then(
        () => {
          logger.info(`resetPassword: invitation sent to: ${recipient}`)
          successfulSends[recipient] = Date.now()
        },
        (err) => {
          logger.error(`resetPassword: ERROR sending invitation to: ${recipient}: ${JSON.stringify(err)}`)
          failedSends[recipient] = err
        })
    }))
  return {
    success: successfulSends,
    errors: failedSends
  }
}

// initialize admin user
if (ADMIN_USER) {
  registerInitialAdminUser(ADMIN_USER).then(
    (user) => { logger.info(`registered admin user: ${user.username}`)},
    (err) => {
      if (err instanceof UserValidationError) {
        const errs = err.errors
        if (Object.keys(errs)
          .find(f => (f === 'email' || f === 'username') && errs[f].find(e => e === ERR_ALREADY_REGISTERED))) {
          logger.info(`registerInitialAdminUser: admin user already registered: ${JSON.stringify(err.errors)}`)
        } else {
          logger.error(`registerInitialAdminUser: ${JSON.stringify(err.errors)}`)
        }
      } else {
        throw err
      }
    }
  )
} else {
  logger.info('userUtil: no admin user defined, not creating')
}

module.exports = {
  USERS_PREFIX,
  userKey,
  startSession,
  newSessionResponse,
  cancelSessions,
  currentUser,
  checkPassword,
  isCorrectVerifyToken,
  isCorrectResetPasswordToken,
  isAdmin,
  requireUser,
  requireLoggedInUser,
  requireAdmin,
  UserValidationError,
  registerUser,
  resetShasum,
  sendResetPasswordMessage,
  findUser,
  updateUserRecord,
  sendInvitations
}
