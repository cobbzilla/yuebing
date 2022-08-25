const u = require('../user/userUtil')
const c = require('../../shared')

export default {
  path: '/',
  async handler (req, res, next) {
    try {
      const user = await u.currentUser(req)
      if (user && user.session && (!req.headers.cookie || req.headers.cookie !== user.session)) {
        console.log(`setting cookie to ${user.session} (previous cookie was ${req.headers.cookie}`)
        res.setHeader('Set-Cookie', user.session)
      }
    } finally {
      next()
    }
  }
}
