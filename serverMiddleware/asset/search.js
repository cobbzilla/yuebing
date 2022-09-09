const shasum = require('shasum')
const { basename } = require('path')

const { chopFileExt, INDEX_STILL_BUILDING_TOKEN } = require('../../shared')
const { MEDIA, mediaType } = require('../../shared/media')
const cache = require('../util/cache')

const system = require('../util/config').SYSTEM
const logger = system.logger
const redis = require('../util/redis')
const { getPathsWithTag, forAllTags } = require('../user/tagUtil')
const { deriveMediaInfo, deriveMetadataFromSourceAndPath } = require('./manifest')

// const exampleQuery = {
//   mediaTypes: ['video', 'audio'],
//   tags: ['birthday', 'family'],
// }

const MAX_QUERY_PAGE_SIZE = 50

// todo: weight results by likes/comments; weight by tags the user has watched the most
const search = async (user, query) => {
  const { stillBuilding, paths } = await _search(user, query)
  if (stillBuilding && stillBuilding.length > 0) {
    logger.warn(`search(${query}) still building indexes for: ${stillBuilding.join(', ')}`)
  }
  const results = paths

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
  return { stillBuilding, objectList }
}

const DEFAULT_SEARCH_TAGS = Object.keys(MEDIA)

const Queue = require('bull')
const redisConfig = system.privateConfig.redis

let BUILD_SEARCH_QUEUE = null

const BUILD_SEARCH_QUEUE_NAME = 'buildSearchIndexQueue'
const BUILD_SEARCH_JOB_NAME = 'buildSearchIndexJob'

const BUILD_SEARCH_PROCESS_FUNCTION = async (job) => {
  logger.info(`initSearchIndex: starting...`)
  const tagInit = async (tag) => {
    logger.debug(`initSearchIndex: indexing tag: ${tag}`)
    await getPathsWithTag(tag)
    logger.debug(`initSearchIndex: finished indexing tag: ${tag}`)
  }
  try {
    const tags = await forAllTags(tagInit)
    logger.info(`initSearchIndex: completed, indexed ${tags.length} tags`)
    return tags
  } catch (e) {
    logger.error(`initSearchIndex error ${e}`)
  }
}

const buildSearchIndexQueue = () => {
  if (BUILD_SEARCH_QUEUE === null) {
    BUILD_SEARCH_QUEUE = new Queue(BUILD_SEARCH_QUEUE_NAME, `redis://${redisConfig.host}:${redisConfig.port}`)
    BUILD_SEARCH_QUEUE.process(BUILD_SEARCH_JOB_NAME, 1, BUILD_SEARCH_PROCESS_FUNCTION)
  }
  return BUILD_SEARCH_QUEUE
}

const BUILD_AT_START = typeof system.privateConfig.redis.buildSearchIndexAtStartup === 'boolean'
  ? system.privateConfig.redis.buildSearchIndexAtStartup
  : false

let initialBuildStarted = false

const buildSearchIndex = async (fromStartup = false) => {
  if (fromStartup) {
    if (!BUILD_AT_START) {
      logger.warn(`initSearchIndex: privateConfig.redis.buildSearchIndexAtStartup is false, not indexing at startup`)
      return null
    } else if (initialBuildStarted) {
      logger.warn(`initSearchIndex already initialized at startup`)
      return null
    }
  }
  initialBuildStarted = true
  buildSearchIndexQueue().add(BUILD_SEARCH_JOB_NAME, {})
}

const _search = async (user, query) => {
  const logPrefix = `search(${JSON.stringify(query)})`
  logger.debug(`${logPrefix} starting`)
  const promises = []
  const tagResults = {}
  const tags = query.tags && query.tags.length > 0 && query.tags.filter(w => w.trim().length > 0).length > 0
    ? query.tags
    : DEFAULT_SEARCH_TAGS
  const pathsWithTags = {}
  const stillBuilding = []
  logger.debug(`${logPrefix} searching for tags: ${tags.join(' ')}`)
  for (const tag of tags) {
    promises.push(new Promise((resolve) => {
      getPathsWithTag(tag).then(
        (paths) => {
          if (paths && paths.length > 0) {
            if (paths.length === 1 && paths[0] === INDEX_STILL_BUILDING_TOKEN) {
              logger.debug(`${logPrefix} getPathsWithTag(${tag}): detected 'still-building' flag for tag`)
              stillBuilding.push(tag)
            } else {
              tagResults[tag] = paths
              for (const path of paths) {
                if (typeof pathsWithTags[path] === 'undefined') {
                  pathsWithTags[path] = []
                }
                pathsWithTags[path].push(tag)
              }
              logger.debug(`${logPrefix} getPathsWithTag(${tag}): pushed paths: ${paths.join(' ')}`)
            }
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
  const paths = tagCounts.map(tc => tc.path)
  return { stillBuilding, paths }
}

buildSearchIndex(true).then((tags) => {
  logger.info(`initSearchIndex returned tags: ${tags.join(' ')}`)
})

export { search, buildSearchIndex }
