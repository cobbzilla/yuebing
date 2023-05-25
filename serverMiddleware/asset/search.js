const { basename } = require('path')

const { chopFileExt, INDEX_STILL_BUILDING_TOKEN } = require('../../shared')
const { mediaType, mediaProfileByName, isThumbnailProfile } = require('../../shared/media')
const cache = require('../util/cache')
const redis = require('../util/redis')

const system = require('../util/config').SYSTEM
const logger = system.logger
const { getPathsWithTag, forAllTags, normalizeTag } = require('../user/tagUtil')
const { deriveMediaInfo, deriveMetadataFromSourceAndPath } = require('./manifest')

// const exampleQuery = {
//   mediaTypes: ['video', 'audio'],
//   tags: ['birthday', 'family'],
// }

const DEFAULT_QUERY_PAGE_SIZE = 20
const MAX_QUERY_PAGE_SIZE = 50

// todo: weight results by likes/comments; weight by tags the user has watched the most
const search = async (user, query) => {
  const { stillBuilding, paths } = await _search(user, query)
  if (stillBuilding && stillBuilding.length > 0) {
    logger.warn(`search(${JSON.stringify(query)}) still building indexes for: ${stillBuilding.join(', ')}`)
  }
  const results = paths
  const pageNum = query.pageNumber || 1
  const pageSize = Math.min(query.pageSize || DEFAULT_QUERY_PAGE_SIZE, MAX_QUERY_PAGE_SIZE)

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
  logger.debug(`search(${JSON.stringify(query)}: sliced results = ${JSON.stringify(results)} -> page(start/end=${start}/${end}) ${JSON.stringify(page)}`)
  const promises = []
  const objectList = []
  for (const sourceAndPath of page) {
    promises.push(new Promise((resolve) => {
      deriveMetadataFromSourceAndPath(sourceAndPath, { noCache: query.noCache }).then(
        (meta) => {
          const metaAssets = meta.assets || {}
          const obj = {}
          obj.name = chopFileExt(basename(sourceAndPath))
          obj.path = sourceAndPath
          obj.mediaType = mediaType(sourceAndPath)
          obj.meta = meta
          obj.meta.assets = {}
          const thumbCandidates = []
          if (metaAssets) {
            for (const p of Object.keys(metaAssets)) {
              const profile = mediaProfileByName(obj.mediaType, p)
              if (profile === null) {
                logger.warn(`search: unknown profile: ${p} (skipping)`)
                continue
              }
              const assets = metaAssets[p]
              if (assets && assets.length > 0) {
                if (isThumbnailProfile(p)) {
                  thumbCandidates.push( ...metaAssets )
                }
                if (p.multiFile) {
                  let objAssets
                  if (assets.length <= 2) {
                    objAssets = assets.slice(0, assets.length)
                  } else {
                    // keep first, middle and last asset
                    objAssets = []
                    objAssets.push(assets[0])
                    objAssets.push(assets[Math.floor(assets.length / 2)])
                    objAssets.push(assets[assets.length - 1])
                  }
                  obj.meta.assets[p] = objAssets
                } else {
                  obj.meta.assets[p] = [ assets[0] ]
                }
              }
            }
          }
          const pageIndex = page.indexOf(obj.path)
          if (pageIndex !== -1) {
            objectList[pageIndex] = obj
          } else {
            objectList.push(obj)
          }
          cache.findSelectedThumbnail(sourceAndPath).then(
            (thumb) => {
              if (thumb) {
                obj.meta.selectedThumbnail = thumb
              } else if (thumbCandidates.length > 0) {
                // pick the second candidate if we have > 1, or the first if it's the only one we have
                obj.meta.selectedThumbnail = thumbCandidates[thumbCandidates.length === 1 ? 0 : 1]
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
  return {
    stillBuilding,
    objectList: objectList.filter(e => e),
    total: results.length,
    start,
    end,
    more: end < results.length
  }
}

const Queue = require('bull')
const redisConfig = system.privateConfig.redis

let BUILD_SEARCH_QUEUE = null

const BUILD_SEARCH_QUEUE_NAME = 'buildSearchIndexQueue'
const BUILD_SEARCH_JOB_NAME = 'buildSearchIndexJob'

const TAG_WEIGHTS_CACHE_KEY = '__ybTagWeights'
const MAX_TAG_WEIGHTS = 30

const getTagWeights = async () => {
  const weights = await redis.getJson(TAG_WEIGHTS_CACHE_KEY)
  if (weights !== null) {
    return weights
  }
  // check filesystem
  const fsCache = await system.storage.safeReadFile(TAG_WEIGHTS_CACHE_KEY)
  if (fsCache !== null) {
    await redis.set(TAG_WEIGHTS_CACHE_KEY, fsCache.toString())
    return JSON.parse(fsCache.toString())
  }
  return null
}

const envExcludeTagCloudWords = () => typeof process.env.YB_TAGCLOUD_EXCLUDE_WORDS === 'string'
  ? process.env.YB_TAGCLOUD_EXCLUDE_WORDS.split(/[,\s]+/)
  : []

const EXCLUDE_TAG_CLOUD_WORDS = ['video', 'videos', 'mp4', 'video-mp4', 'mpeg', 'mpeg-4', ...envExcludeTagCloudWords()]

const showTagInCloud = word => !EXCLUDE_TAG_CLOUD_WORDS.includes(Array.isArray(word) ? word[0] : word)

const BUILD_SEARCH_PROCESS_FUNCTION = async (job) => {
  const TAG_WEIGHTS = []
  const tagInit = async (tag) => {
    logger.debug(`initSearchIndex: indexing tag: ${tag}`)
    const paths = await getPathsWithTag(tag)
    if (paths && paths.length && paths.length >= 0 && (paths.length > 1 || paths[0] !== INDEX_STILL_BUILDING_TOKEN)) {
      logger.debug(`initSearchIndex: finished indexing tag ${tag}, paths=${typeof paths === 'undefined' ? 'undefined' : JSON.stringify(paths)}`)
      TAG_WEIGHTS.push([normalizeTag(tag), paths.length])
    } else {
      logger.debug(`initSearchIndex: finished indexing tag ${tag}, INVALID paths=${typeof paths === 'undefined' ? 'undefined' : JSON.stringify(paths)}`)
    }
  }
  try {
    const tags = await forAllTags(tagInit)
    logger.info(`initSearchIndex: completed, indexed ${tags.length} tags and caching ${TAG_WEIGHTS.length} tagWeights`)
    const weights = TAG_WEIGHTS
      .filter(showTagInCloud)
      .sort((w1, w2) => w2[1] - w1[1])
      .slice(0, MAX_TAG_WEIGHTS)
    const json = JSON.stringify(weights)
    await redis.set(TAG_WEIGHTS_CACHE_KEY, json)
    await system.storage.writeFile(TAG_WEIGHTS_CACHE_KEY, json)
    return tags
  } catch (e) {
    logger.error(`initSearchIndex: error ${e}`)
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
  const logPrefix = `_search(${JSON.stringify(query)})`
  logger.debug(`${logPrefix} starting`)
  const promises = []
  const tagResults = {}
  const tags = query.tags && query.tags.length > 0 && query.tags.filter(w => w.trim().length > 0).length > 0
    ? query.tags
    : null
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
  tagCounts.sort((o1, o2) => o2.matchCount === o1.matchCount
    ? basename(o1.path).localeCompare(basename(o2.path))
    : o2.matchCount - o1.matchCount)
  const paths = tagCounts.map(tc => tc.path)
  return { stillBuilding, paths }
}

buildSearchIndex(true).then((tags) => {
  logger.info(`initSearchIndex returned tags: ${tags && tags.length && tags.length > 0 ? tags.join(' ') : 'null/undefined'}`)
})

export { search, buildSearchIndex, getTagWeights }
