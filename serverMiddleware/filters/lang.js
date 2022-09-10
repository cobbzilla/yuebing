const { currentUser } = require('../user/userUtil')
const { localeLang } = require('../../shared/locale')

export default {
  path: '/',
  async handler (req, res, next) {
    try {
      const user = await currentUser(req)
      if (user && user.locale) {
        const lang = localeLang(user.locale)
        if (lang) {
          res.setHeader('Content-Language', lang)
        }
      }
    } finally {
      next()
    }
  }
}
