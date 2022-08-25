const shared = require('../../../shared')
const api = require('../../util/api')
const u = require('../../user/userUtil')
const src = require('../../source/sourceUtil')

async function head (req, res, source, path) {
  const head = await source.safeMetadata(path)
  if (head) {
    res.statusCode = 200
    res.end(head)
  } else {
    api.notFound(res)
  }
}

async function get (req, res, source, path) {
  const head = await source.safeMetadata(path)
  if (!head) {
    console.log(`stream.get: HEAD request failed, returning 404 Not Found for path=${path}`)
    return api.notFound(res)
  }

  const range = (req.headers && req.headers.Range) ? req.headers.Range : null
  if (range) {
    console.log(`>>>>> API: Streaming ${req.url}, prefix = ${path}, range = ${range}`)
  }

  // todo -- write object to cache
  // then stream from cache as we apply ranges
  res.statusCode = 200
  await source.read(path, chunk => res.write(chunk))
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
    const p = url === '/undefined' ? '' : url.startsWith('/') ? url.substring(1) : req.url

    const { source, pth } = await src.extractSourceAndPathAndConnect(p)
    if (!source || !pth) { return api.notFound() }

    // only HEAD and GET are allowed, return 404 for anything else
    switch (req.method) {
      case 'HEAD':
        await head(req, res, source, pth)
        break
      case 'GET':
        await get(req, res, source, pth)
        break
      default:
        api.notFound(res)
    }
  }
}
