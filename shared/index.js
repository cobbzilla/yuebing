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

const STREAM_API = '/api/s3/stream'

function proxyMediaUrl (asset, user, status) {
  return `${STREAM_API}/${asset}${sessionParams(user, status)}`
}

const HTTP_INVALID_REQUEST_MESSAGE = 'http_invalid_request_method'


export {
  USER_SESSION_HEADER, USER_SESSION_QUERY_PARAM, STREAM_API,
  HTTP_INVALID_REQUEST_MESSAGE,
  snooze, getExtension,
  sessionParams, proxyMediaUrl
}
