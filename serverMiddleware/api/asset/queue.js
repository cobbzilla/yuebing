const q = require('../../asset/job')
const u = require('../../user/userUtil')

export default {
  path: '/api/asset/queue',
  async handler (req, res) {
    const user = await u.currentUser(req)
    console.log(`>>>>> API: Queue ${req.url}, user=${JSON.stringify(user)}`)
    const queue = q.getQueue()

    res.statusCode = 200
    res.contentType = 'application/json'
    res.end(JSON.stringify(queue, null, 2))
  }
}
