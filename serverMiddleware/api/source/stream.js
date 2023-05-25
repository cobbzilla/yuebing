const { basename } = require('path')
const mime = require('mime-types')
const shared = require('../../../shared')
const { mediaType } = require('../../../shared/media')
const { ASSET_PREFIX, PROFILE_ADDITIONAL_REGEXES } = require('../../../shared/media')
const api = require('../../util/api')
const { queryParamValue } = require('../../util/api')
const system = require('../../util/config').SYSTEM
const logger = system.logger
const { currentUser, isAdminOrVerified } = require('../../user/userUtil')
const { loadMediaDriver } = require('../../asset/driver')

async function head (req, res, storage, path) {
  const head = await storage.safeMetadata(path)
  if (head) {
    res.statusCode = 200
    res.end(head)
  } else {
    api.notFound(res)
  }
}

async function get (req, res, storage, path, quality = null) {
  const head = await storage.safeMetadata(path)
  if (!head) {
    logger.info(`stream.get: HEAD request failed, returning 404 Not Found for path=${path}`)
    return api.notFound(res)
  }

  const range = (req.headers && req.headers.Range) ? req.headers.Range : null
  if (range) {
    logger.warn(`>>>>> API: Streaming ${req.url}, prefix = ${path}, range = ${range} NOT SUPPORTED`)
  }

  // todo -- write object to cache
  // then stream from cache as we apply ranges
  res.statusCode = 200
  res.contentType = mime.contentType(basename(path))
  logger.info(`stream >>>> set contentType = ${res.contentType} for path=${path}`)
  if (quality !== null) {
    // allow type-specific drivers to adjust stream based on quality
    const mt = mediaType(path)
    if (mt) {
      const mediaDriver = loadMediaDriver(mt)
      if (mediaDriver && typeof mediaDriver.quality === 'function') {
        if (await mediaDriver.quality(storage, path, quality, res)) {
          res.end()
          return
        }
      }
    }
  }
  await storage.read(path, chunk => res.write(chunk))
  res.end()
}

// todo: update to specify destination to stream from, there might be more than one
export default {
  path: shared.STREAM_API,
  async handler (req, res) {
    const user = await currentUser(req)
    if (!isAdminOrVerified(user) && !system.isPublic()) {
      return api.okJson(res, {})
    }

    // chop query if any
    const url = req.url.includes('?') ? req.url.substring(0, req.url.indexOf('?')) : req.url

    // chop leading / if present
    const p = url.startsWith('/') ? url.substring(1) : req.url

    // Can only stream assets, nothing else
    if (!p.startsWith(system.assetsPrefix) || !basename(p).startsWith(ASSET_PREFIX)) {
      if (PROFILE_ADDITIONAL_REGEXES.find(regex => regex.test(basename(p)))) {
        logger.info(`${shared.STREAM_API} allowing path ${p} due to additionalAssets exception`)
      } else {
        return api.notFound(res, url)
      }
    }

    // only HEAD and GET are allowed, return 404 for anything else
    switch (req.method) {
      case 'HEAD':
        await head(req, res, system.api, p)
        break
      case 'GET':
        await get(req, res, system.api, p, queryParamValue(req, shared.QUALITY_PARAM))
        break
      default:
        api.notFound(res)
    }
  }
}
