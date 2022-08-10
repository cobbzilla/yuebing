export default {
  path: '/api/users',
  handler (req, res) {
    const prefix = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
    console.log(`>>>>> API: Querying or updating/deleting user(s) ${req.url}, prefix = ${prefix}`)
    res.end('OK')
  }
}
