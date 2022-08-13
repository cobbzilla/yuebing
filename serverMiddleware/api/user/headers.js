const api = require('../../util/api')

export default {
  path: '/api/user/headers',
  handler (req, res) {
    req.on('data', () => api.okJson(res, req.headers))
  }
}
