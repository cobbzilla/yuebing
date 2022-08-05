const uuid = require('uuid')
const shasum = require('shasum')
const redis = require('../redis')
const nuxt = require('../../nuxt.config')

const USER_STORE_PREFIX = 'users/'

function sanitizeUsername (username) {
  return username.replace(/[\W_.-]+/g,' ')
}

function userKey (username) {
  return USER_STORE_PREFIX + shasum(nuxt.default.privateRuntimeConfig.userEncryptionKey + ':' + sanitizeUsername(username))
}

async function startSession (user) {
  delete user.password
  delete user.hashedPassword
  user.session = uuid.v4() + '.' + Math.floor(Math.random() * 1000000)
  await redis.set(user.session, JSON.stringify(user), nuxt.default.privateRuntimeConfig.sessionExpiration)
  return user
}

export { userKey, startSession }
