const crypto = require('crypto')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM

export default {
  path: '/api/user/config',
  handler (req, res) {
    const cryptoInfo = crypto.getCiphers().map((c) => {
      return {
        name: c,
        info: crypto.getCipherInfo(c)
      }
    })
    return api.okJson(res, Object.assign({}, system.publicConfig, { crypto: cryptoInfo }))
  }
}
