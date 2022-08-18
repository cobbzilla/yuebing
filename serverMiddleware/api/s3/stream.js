const shared = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const s3util = require('../../s3/s3util')

async function head (req, res, path) {
  const head = await s3util.headDestObject(path)
  if (head) {
    res.statusCode = 200
    res.end(head)
  } else {
    api.notFound(res)
  }
}

async function get (req, res, path) {
  const head = await s3util.headDestObject(path)
  if (!head) {
    console.log(`stream.get: HEAD request failed, returning 404 Not Found for path=${path}`)
    return api.notFound(res)
  }

  const range = (req.headers && req.headers.Range) ? req.headers.Range : null
  if (range) {
    console.log(`>>>>> API: Streaming ${req.url}, prefix = ${path}, range = ${range}`)
  }

  res.statusCode = 200
  await s3util.streamDestObject(path, res, range)
  res.end()
}

export default {
  path: shared.STREAM_API,
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return
    }

    // chop query if any
    const url = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url

    // adjust for undefined paths, chop leading / if present
    const path = url === '/undefined' ? '' : url.startsWith('/') ? url.substring(1) : req.url

    // only HEAD and GET are allowed, return 404 for anything else
    switch (req.method) {
      case 'HEAD':
        await head(req, res, path)
        break
      case 'GET':
        await get(req, res, path)
        break
      default:
        api.notFound(res)
    }
  }
}
