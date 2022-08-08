const s3util = require('../../s3/s3util')

function notFound (res) {
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
    notFound(res)
    return
  }

  const range = (req.headers && req.headers.Range) ? req.headers.Range : null
  if (range) {
    console.log(`'>>>>> API: Proxying ${req.url}, prefix = ${path}, range = ${range}`)
  }

  res.statusCode = 200
  await s3util.streamDestObject(path, res, range)
  res.end()
}

export default {
  path: '/s3/proxy',
  async handler (req, res) {
    const path = req.url === '/undefined' ? '' : req.url.startsWith('/') ? req.url.substring(1) : req.url
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
