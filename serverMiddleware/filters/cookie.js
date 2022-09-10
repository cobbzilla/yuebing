const cookie = require('cookie')
const { currentUser } = require('../user/userUtil')
const c = require('../../shared')
const api = require('../util/api')

function hasCorrectCookie (ck, name, value) {
  if (!ck) {
    return false
  }
  const cookies = cookie.parse(ck)
  return cookies && cookies[c.USER_SESSION_HEADER] && cookies[c.USER_SESSION_HEADER] === value
}

export default {
  path: '/',
  async handler (req, res, next) {
    try {
      if (req.url && !req.url.startsWith('/api')) {
        const user = await currentUser(req)
        if (user && user.session) {
          if (!hasCorrectCookie(req.headers.cookie, c.USER_SESSION_HEADER, user.session)) {
            api.setSessionCookie(res, user.session)
          }
        }
      }
    } finally {
      next()
    }
  }
}
