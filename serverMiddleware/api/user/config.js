const api = require('../../util/api')
const system = require('../../util/config').SYSTEM

export default {
  path: '/api/user/config',
  handler (req, res) {
    return api.okJson(res, JSON.stringify(system.publicConfig))
  }
}
