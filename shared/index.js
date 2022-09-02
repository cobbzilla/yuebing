//
// Files in this directory are the only code shared between both client and server.
// As such, code here should remain very simple. Constants. Stateless methods. Nothing too fancy.
//
const nuxt = require('../nuxt.config').default

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

// adapted from https://stackoverflow.com/a/1203361
function getExtension (filename) {
  return filename.split('.').pop()
}

const USER_SESSION_HEADER = 'x-yb-session'
const USER_SESSION_QUERY_PARAM = 's'
const ANON_LOCALE_STORAGE_KEY = 'anon_locale'
const DEFAULT_LOCALE = nuxt.publicRuntimeConfig.defaultLocale || 'en'

function sessionParams (user, status) {
  if (nuxt.publicRuntimeConfig.public ||
    !user || !user.session ||
    !status || !status.loggedIn) {
    return ''
  }
  return `?${USER_SESSION_QUERY_PARAM}=${user.session}`
}

const STREAM_API = '/api/source/stream'

function proxyMediaUrl (asset, user, status) {
  return `${STREAM_API}/${asset}${sessionParams(user, status)}`
}

function normalizeUrl (base, path) {
  return (base.endsWith('/') ? base : base + '/') +
    (path.startsWith('/') ? path.substring(1) : path)
}

const HTTP_INVALID_REQUEST_MESSAGE = 'http_invalid_request_method'

const okl = obj => typeof obj === 'object' ? Object.keys(obj).length : 0

const empty = thing =>
  typeof thing === 'undefined' ||
  thing === null ||
  (thing.length && thing.length === 0) ||
  (typeof thing === 'object' && okl(thing) === 0)

const chopFileExt = (s) => {
  const dot = s.indexOf('.')
  return dot === -1 || dot === s.length ? s : s.substring(0, dot)
}

const LAST_MODIFIED_FILE = 'lastModified'
const SELECTED_THUMBNAIL_FILE = 'selectedThumbnail.json'
const ERROR_FILE_PREFIX = '_error_'

const MULTIFILE_PLACEHOLDER = '%03d'
const MULTIFILE_FIRST = '001'

const DEFAULT_ENCRYPTION_ALGO = 'aes-256-cbc'

const publicConfigField = (vue, field) => {
  return vue && vue.publicConfig && vue.publicConfig[field] ? vue.publicConfig[field] : undefined
}

const SELF_SOURCE_NAME = ' ~ this ~ '

module.exports = {
  USER_SESSION_HEADER,
  USER_SESSION_QUERY_PARAM,
  ANON_LOCALE_STORAGE_KEY,
  DEFAULT_LOCALE,
  STREAM_API,
  HTTP_INVALID_REQUEST_MESSAGE,
  LAST_MODIFIED_FILE,
  SELECTED_THUMBNAIL_FILE,
  ERROR_FILE_PREFIX,
  MULTIFILE_PLACEHOLDER,
  MULTIFILE_FIRST,
  DEFAULT_ENCRYPTION_ALGO,
  SELF_SOURCE_NAME,
  publicConfigField,
  okl,
  empty,
  chopFileExt,
  snooze,
  getExtension,
  sessionParams,
  normalizeUrl,
  proxyMediaUrl
}
