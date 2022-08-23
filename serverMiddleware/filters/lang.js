const u = require('../user/userUtil')
const loc = require('../../shared/locale')

export default {
  path: '/',
  async handler (req, res, next) {
    try {
      const user = await u.currentUser(req)
      if (user && user.locale) {
        const lang = loc.localeLang(user.locale)
        if (lang) {
          res.setHeader('Content-Language', lang)
        }
      }
    } finally {
      next()
    }
  }
}
