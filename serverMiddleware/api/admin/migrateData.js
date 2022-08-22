const api = require('../../util/api')
const u = require('../../user/userUtil')
const userAdmin = require('../../user/userAdmin')
const system = require('../../util/config').SYSTEM

const DATA_ENC_KEY = system.privateConfig.encryption.key
const DATA_ENC_ALGO = system.privateConfig.encryption.algo

export default {
  path: '/api/admin/migrateUsers',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return
    }
    if (req.method !== 'POST') {
      return api.forbidden(res)
    }

    console.log(`>>>>> API: Migrate Users ${req.url}`)
    req.on('data', (data) => {
      res.contentType = 'application/json'
      const oldInfo = JSON.parse(data)
      const oldKey = oldInfo.oldKey
      const oldIV = oldInfo.oldIV
      const oldAlgo = oldInfo.oldAlgo || DATA_ENC_ALGO
      if (oldKey === DATA_ENC_KEY) {
        res.statusCode = 422
        res.end('{ "oldKey": ["sameAsCurrentKey"] }')
      } else {
        userAdmin.migrateUsers(oldKey, oldIV, oldAlgo).then((results) => {
          return api.okJson(res, results)
        },
        (err) => {
          return api.serverError(res, `migrateUsers ERROR: ${err}`)
        })
      }
    })
  }
}
