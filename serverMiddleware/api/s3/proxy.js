const u = require('../../user/userUtil')
const s3util = require('../../s3/s3util')

function notFound (res) {
  console.log(`notFound: returning from: ${new TypeError('wtf').stack}`)
  res.statusCode = 404
  res.end('Not Found')
}

async function head (req, res, path) {
  const head = await s3util.headDestObject(path)
  if (head) {
    res.statusCode = 200
    res.end(head)
  } else {
    notFound(res)
  }
}

async function get (req, res, path) {
  const head = await s3util.headDestObject(path)
  if (!head) {
    console.log(`proxy.get: HEAD request failed, returning 404 Not Found for path=${path}`)
    notFound(res)
    return
  }

  const range = (req.headers && req.headers.Range) ? req.headers.Range : null
  if (range) {
    console.log(`>>>>> API: Proxying ${req.url}, prefix = ${path}, range = ${range}`)
  }

  res.statusCode = 200
  await s3util.streamDestObject(path, res, range)
  res.end()
}

export default {
  path: '/api/s3/proxy',
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
        notFound(res)
    }
  }
}
