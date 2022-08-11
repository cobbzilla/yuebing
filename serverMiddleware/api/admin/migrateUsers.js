const nuxt = require('../../../nuxt.config')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')

const USER_ENC_KEY = nuxt.default.privateRuntimeConfig.userEncryption.key

export default {
  path: '/api/admin/migrateUsers',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return
    }
    if (req.method !== 'POST') {
      return u.forbidden(res)
    }

    console.log(`>>>>> API: Migrate Users ${req.url}`)
    req.on('data', (data) => {
      res.contentType = 'application/json'
      const oldInfo = JSON.parse(data)
      const oldKey = oldInfo.oldKey
      const oldIV = oldInfo.oldIV
      if (oldKey === USER_ENC_KEY) {
        res.statusCode = 422
        res.end('{ "oldKey": ["sameAsCurrentKey"] }')
      } else {
        userAdmin.migrateUsers(oldKey, oldIV).then((results) => {
          return api.okJson(res, results)
        },
        (err) => {
          return api.serverError(res, `migrateUsers ERROR: ${err}`)
        })
      }
    })
  }
}
