const cookie = require('cookie')
const { MobilettoNotFoundError } = require('mobiletto')
const src = require('../source/sourceUtil')
const c = require('../../shared')
const system = require('../util/config').SYSTEM

function okJson (res, obj) {
  res.statusCode = 200
  res.contentType = 'application/json'
  res.end(JSON.stringify(obj))
  return null
}

function forbidden (res) {
  res.statusCode = 403
  res.end()
  return null
}

function notFound (res, message = null) {
  res.statusCode = 404
  if (message) {
    res.end(message)
  } else {
    res.end()
  }
  return null
}

function redirect (res, path) {
  res.header('Location', path)
  res.statusCode = 302
  res.end()
}

function serverError (res, message) {
  res.statusCode = 500
  res.end(`${message}`)
  return null
}

function badRequest (res, message) {
  res.statusCode = 400
  res.end(message)
  return null
}

function validationFailed (res, errors) {
  res.statusCode = 422
  res.end(JSON.stringify(errors))
  return null
}

function handleValidationError (res, e) {
  if (e.errors) {
    validationFailed(res, e.errors)
  } else {
    serverError(res, `Error: ${e}`)
  }
}

function handleSourceError (res, e) {
  return (e instanceof src.SourceNotFoundError) || (e instanceof MobilettoNotFoundError)
    ? notFound(res, e.message)
    : serverError(res, 'error listing')
}

const SESSION_MAX_AGE_SECONDS =
  (system.privateConfig?.session?.expiration || 1000 * 60 * 60 * 24) / 1000 // default 24 hours

const COOKIE_PARAMS = { maxAge: SESSION_MAX_AGE_SECONDS, path: '/', sameSite: 'strict' }
const EXPIRE_COOKIE_PARAMS = { maxAge: 10, path: '/', sameSite: 'strict' }

function setSessionCookie (res, session) {
  res.setHeader('Set-Cookie', cookie.serialize(c.USER_SESSION_HEADER, session, COOKIE_PARAMS))
}

function clearSessionCookie (res, session) {
  res.setHeader('Set-Cookie', cookie.serialize(c.USER_SESSION_HEADER, session, EXPIRE_COOKIE_PARAMS))
}

module.exports = {
  okJson,
  forbidden,
  notFound,
  redirect,
  serverError,
  badRequest,
  validationFailed,
  handleValidationError,
  handleSourceError,
  setSessionCookie,
  clearSessionCookie
}
