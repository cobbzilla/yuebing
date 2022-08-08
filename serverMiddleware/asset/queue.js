const q = require('./job')

export default {
  path: '/asset/queue',
  handler (req, res) {
    console.log(`'>>>>> API: Queue ${req.url}`)
    res.statusCode = 200
    res.contentType = 'application/json'
    const queue = q.getQueue()
    res.end(JSON.stringify(queue, null, 2))
  }
}
