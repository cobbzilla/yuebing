const shasum = require('shasum')
const { basename } = require('path')

const { chopFileExt } = require('../../shared')
const { MEDIA, mediaType } = require('../../shared/media')
const cache = require('../util/cache')

const system = require('../util/config').SYSTEM
const logger = system.logger
const redis = require('../util/redis')
const content = require('./content')
const { deriveMediaInfo, deriveMetadataFromSourceAndPath } = require('./manifest')

// const exampleQuery = {
//   mediaTypes: ['video', 'audio'],
//   tags: ['birthday', 'family'],
// }

const MAX_QUERY_PAGE_SIZE = 50

// todo: weight results by likes/comments; weight by tags the user has watched the most
const search = async (user, query) => {
  const results = await _search(user, query)

  const pageNum = query.pageNumber || 1
  const pageSize = Math.min(query.pageSize || 20, MAX_QUERY_PAGE_SIZE)

  let start = query.offset || (pageNum - 1) * pageSize
  let end = start + pageSize
  if (start >= results.length) {
    start = Math.max(0, results.length - pageSize)
    end = Math.min(start + pageSize, results.length)
  } else if (end >= results.length) {
    end = results.length
    start = Math.max(end - pageSize, 0)
  }

  const page = results.slice(start, end)
  const promises = []
  const objectList = []
  for (const sourceAndPath of page) {
    promises.push(new Promise((resolve) => {
      deriveMetadataFromSourceAndPath(sourceAndPath).then(
        (meta) => {
          const obj = {}
          obj.name = chopFileExt(basename(sourceAndPath))
          obj.path = sourceAndPath
          obj.mediaType = mediaType(sourceAndPath)
          obj.meta = meta
          objectList.push(obj)
          cache.findSelectedThumbnail(sourceAndPath).then(
            (thumb) => {
              if (thumb) {
                obj.meta.selectedThumbnail = thumb
              }
            }).then(
            async () => {
              obj.mediainfo = await deriveMediaInfo(meta, sourceAndPath)
              if (obj.mediainfo && obj.mediainfo.title && obj.mediainfo.title.length > 0) {
                obj.name = obj.mediainfo.title
              }
              resolve()
            })
        })
    }))
  }
  await Promise.all(promises)
  return objectList
}

const SEARCH_CACHE_PREFIX = '_search_'
const SEARCH_CACHE_EXPIRATION = 1000 * 60 * 10
const cache_enabled = true

const DEFAULT_SEARCH_TAGS = Object.keys(MEDIA)

const _search = async (user, query) => {
  const logPrefix = `search(${JSON.stringify(query)})`
  logger.debug(`${logPrefix} starting`)
  const cacheKey = SEARCH_CACHE_PREFIX + shasum((user ? JSON.stringify(user) : '-') + '\n' + JSON.stringify(query))
  const cached = cache_enabled ? await redis.get(cacheKey) : null
  if (cached) {
    const cachedResults = JSON.parse(cached)
    logger.debug(`${logPrefix} returning ${cachedResults.length} cached results`)
    return cachedResults
  } else {
    logger.debug(`${logPrefix} not cached, or cached disabled, performing search...`)
  }
  const promises = []
  const tagResults = {}
  const tags = query.tags && query.tags.length > 0 && query.tags.filter(w => w.trim().length > 0).length > 0
    ? query.tags
    : DEFAULT_SEARCH_TAGS
  const pathsWithTags = {}
  logger.debug(`${logPrefix} searching for tags: ${tags.join(' ')}`)
  for (const tag of tags) {
    promises.push(new Promise((resolve) => {
      content.getPathsWithTag(tag).then(
        (paths) => {
          if (paths && paths.length > 0) {
            tagResults[tag] = paths
            for (const path of paths) {
              if (typeof pathsWithTags[path] === 'undefined') {
                pathsWithTags[path] = []
              }
              pathsWithTags[path].push(tag)
            }
            logger.debug(`${logPrefix} getPathsWithTag(${tag}): pushed paths: ${paths.join(' ')}`)
          }
          logger.debug(`${logPrefix} resolving getPathsWithTag(${tag})`)
          resolve()
        })
    }))
  }
  logger.info(`${logPrefix} awaiting ${promises.length} promises...`)
  await Promise.all(promises)
  logger.info(`${logPrefix} all the ${promises.length} promises returned`)

  // which paths matched the most tags?
  const tagCounts = []
  for (const path of Object.keys(pathsWithTags)) {
    const matchCount = pathsWithTags[path].length
    tagCounts.push({
      path,
      matchCount
    })
  }
  tagCounts.sort((o1, o2) => o2.matchCount - o1.matchCount)
  const matchedPaths = tagCounts.map(tc => tc.path)
  await redis.set(cacheKey, JSON.stringify(matchedPaths), SEARCH_CACHE_EXPIRATION)
  return matchedPaths
}

export { search }
