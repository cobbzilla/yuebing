const q = require('../../asset/job')

export default {
  path: '/api/asset/queue',
  handler (req, res) {
    console.log(`'>>>>> API: Queue ${req.url}`)
    const queue = q.getQueue()

    res.statusCode = 200
    res.contentType = 'application/json'
    res.end(JSON.stringify(queue, null, 2))
  }
}
