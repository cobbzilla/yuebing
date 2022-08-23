//
// Files in this directory are the only code shared between both client and server.
// As such, code here should remain very simple. Constants. Stateless methods. Nothing too fancy.
//

const shasum = require('shasum')
const nuxt = require('../nuxt.config').default

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

// adapted from https://stackoverflow.com/a/1203361
function getExtension (filename) {
  return filename.split('.').pop()
}

const USER_SESSION_HEADER = 'x-yuebing-session'
const USER_SESSION_QUERY_PARAM = 's'

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

const HTTP_INVALID_REQUEST_MESSAGE = 'http_invalid_request_method'

const INCLUDE_ORIG_FILENAME_CHARS = 20
function scrub (path) {
  // replace all nonalphanumeric chars with underscores
  const scrubbed = path.replace(/[\W_]+/g, '_')

  // retain the first several characters, then add a hash
  return (scrubbed.length < INCLUDE_ORIG_FILENAME_CHARS
    ? scrubbed
    : scrubbed.substring(scrubbed.length - INCLUDE_ORIG_FILENAME_CHARS, scrubbed.length)) +
    '_' + shasum(path)
}

const LAST_MODIFIED_FILE = 'lastModified'
const SELECTED_THUMBNAIL_FILE = 'selectedThumbnail.json'
const ERROR_FILE_PREFIX = '_error_'

const MULTIFILE_PLACEHOLDER = '%03d'
const MULTIFILE_FIRST = '001'

const DEFAULT_ENCRYPTION_ALGO = 'aes-256-cbc'

module.exports = {
  USER_SESSION_HEADER,
  USER_SESSION_QUERY_PARAM,
  STREAM_API,
  HTTP_INVALID_REQUEST_MESSAGE,
  LAST_MODIFIED_FILE,
  SELECTED_THUMBNAIL_FILE,
  ERROR_FILE_PREFIX,
  MULTIFILE_PLACEHOLDER,
  MULTIFILE_FIRST,
  DEFAULT_ENCRYPTION_ALGO,
  snooze,
  scrub,
  getExtension,
  sessionParams,
  proxyMediaUrl
}
