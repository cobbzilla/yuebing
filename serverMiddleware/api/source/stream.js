const path = require('path')
const mime = require('mime-types')
const shared = require('../../../shared')
const m = require('../../../shared/media')
const api = require('../../util/api')
const system = require('../../util/config').SYSTEM
const u = require('../../user/userUtil')

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
    console.warn(`>>>>> API: Streaming ${req.url}, prefix = ${path}, range = ${range} NOT SUPPORTED`)
  }

  // todo -- write object to cache
  // then stream from cache as we apply ranges
  res.statusCode = 200
  res.contentType = mime.contentType(path)
  console.log(`stream >>>> set contentType = ${res.contentType} for path=${path}`)
  await source.read(path, chunk => res.write(chunk))
  res.end()
}

export default {
  path: shared.STREAM_API,
  async handler (req, res) {
    const user = await u.requireUser(req, res)
    if (!user) {
      return api.okJson(res, {})
    }

    // chop query if any
    const url = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url

    // chop leading / if present
    const p = url.startsWith('/') ? url.substring(1) : req.url

    // Can only stream assets, nothing else
    if (!p.startsWith(system.assetsPrefix) || !path.basename(p).startsWith(m.ASSET_PREFIX)) {
      return api.notFound(res, url)
    }

    // only HEAD and GET are allowed, return 404 for anything else
    switch (req.method) {
      case 'HEAD':
        await head(req, res, system.api, p)
        break
      case 'GET':
        await get(req, res, system.api, p)
        break
      default:
        api.notFound(res)
    }
  }
}
