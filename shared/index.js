//
// Files in this directory are the only code shared between both client and server.
// As such, code here should remain very simple. Constants. Stateless methods. Nothing too fancy.
//

const nuxt = require('../nuxt.config')

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

// adapted from https://stackoverflow.com/a/1203361
function getExtension (filename) {
  return filename.split('.').pop()
}

const USER_SESSION_HEADER = 'x-s3vid-session'
const USER_SESSION_QUERY_PARAM = 's'

function sessionParams () {
  if (nuxt.default.publicRuntimeConfig.public ||
    !this.user || !this.user.session ||
    !this.status || !this.status.loggedIn) {
    return ''
  }
  return `?${USER_SESSION_QUERY_PARAM}=${this.user.session}`
}

const PROXY_API = '/api/s3/proxy'

function proxyMediaUrl (asset) {
  return `${PROXY_API}/${asset}${sessionParams()}`
}

export {
  USER_SESSION_HEADER, USER_SESSION_QUERY_PARAM, PROXY_API,
  snooze, getExtension,
  sessionParams, proxyMediaUrl
}
