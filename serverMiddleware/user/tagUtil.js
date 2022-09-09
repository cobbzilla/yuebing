const shasum = require('shasum')
const { dirname, basename } = require('path')
const { chopFileExt, isAllDigitsOrNonWordChars, INDEX_STILL_BUILDING_TOKEN } = require('../../shared')
const { extractSourceAndPath } = require('../../shared/source')
const { mediaType, objectEncodePath, objectDecodePath } = require('../../shared/media')
const { MEDIAINFO_FIELDS, mediaInfoFields } = require('../../shared/mediainfo')
const { stopWords } = require('../../shared/locale')
const system = require('../util/config').SYSTEM
const logger = system.logger
const redis = require('../util/redis')
const { deriveMediaInfo } = require('../asset/manifest')

const PATH_INDEX = 'indexes/paths/'
const TAGS_INDEX = 'indexes/tags/'
const TAG_TO_CONTENT_INDEX = TAGS_INDEX + 'tagsToContent/'
const CONTENT_TO_TAG_INDEX = TAGS_INDEX + 'contentToTags/'

const MIN_TAG_LENGTH = 3

const getPathIndex = (sourceAndPath) => {
  const { sourceName, pth } = extractSourceAndPath(sourceAndPath)
  const dirHash = shasum(dirname(pth))
  return `${PATH_INDEX}${dirHash.substring(0, 2)}/${dirHash.substring(2, 4)}/${dirHash.substring(4, 6)}/${shasum(sourceAndPath)}`
}

const pathRegistrationAge = async (sourceAndPath) => {
  const pathIndex = getPathIndex(sourceAndPath)
  const fileMeta = await system.api.safeMetadata(pathIndex)
  return fileMeta && fileMeta.mtime ? (Date.now() - fileMeta.mtime) : null
}

/*
 * When a path is registered:
 * - The metadata is written to indexes/paths/<3-sha-hash-dirs-of-dirname(path)>/<full-sha-of-sourceAndPath>
 *   - this path becomes the canonical reference path for the content
 *   - other indexes will point to this path, using a filename that is a specially-encoded version of the path itself
 * - The tags index is updated. For each tag associated with the content, two files are written:
 *   - The encoded path file is touched: indexes/tags/tagsToContent/<3-sha-hash-dirs-of-tag-name>/<full-sha-of-tag>/<encoded-path>
 *   - The tag file is touched: indexes/tags/contentToTags/<3-sha-hash-dirs-of-sourceAndPath>/<full-sha-of-sourceAndPath>/<tag>
 */
const registerPath = async (sourceAndPath, meta) => {
  const logPrefix = `registerPath(${sourceAndPath})`

  // start with fresh set of tags
  logger.debug(`${logPrefix} removing all tags`)
  try {
    await removeAllTagsForPath(sourceAndPath)
  } catch (e) {
    logger.error(`${logPrefix} error removing tags: ${e}`)
  }

  // find tags in filename
  // add every word in the path
  const foundTags = sourceAndPath.split(/[\W_]+/)
  // add complete path-parts (but not filename extensions)
  foundTags.push(...dirname(sourceAndPath).split('/'))
  // add complete filename without extension
  foundTags.push(chopFileExt(basename(sourceAndPath)))
  // add tag for media type ('video', etc)
  foundTags.push(mediaType(sourceAndPath))

  logger.debug(`${logPrefix} finding mediainfo`)
  const userMediaInfo = await deriveMediaInfo(meta, sourceAndPath, { cache: false })
  if (userMediaInfo) {
    for (const field of mediaInfoFields()) {
      if (!userMediaInfo[field] || userMediaInfo[field].length === 0 || (MEDIAINFO_FIELDS[field] && MEDIAINFO_FIELDS[field].disableIndex)) {
        continue
      }
      foundTags.push(...userMediaInfo[field].split(/[\W_]+/))
      if (MEDIAINFO_FIELDS[field] && !MEDIAINFO_FIELDS[field].disableWholeFieldIndex) {
        foundTags.push(userMediaInfo[field])
      }
    }
  }

  // unique-ify tags using a Set, remove small tags, numbers and stopwords
  const stops = stopWords()
  const tagsToAdd = [...new Set(foundTags.map(t => normalizeTag(t)))]
    .filter(w => w.length >= MIN_TAG_LENGTH && !isAllDigitsOrNonWordChars(w))
    .filter(w => !stops.includes(w.toLowerCase()))

  // write to path index
  const pathIndex = getPathIndex(sourceAndPath)
  logger.debug(`${logPrefix} writing pathIndex ${pathIndex}`)
  try {
    await system.api.writeFile(pathIndex, JSON.stringify(meta))
  } catch (e) {
    logger.error(`${logPrefix} error writing pathIndex: ${pathIndex}: ${e}`)
    throw e
  }

  // add tags
  for (const tag of tagsToAdd) {
    try {
      logger.debug(`${logPrefix} adding tag: ${tag}`)
      await addTag(sourceAndPath, tag)
    } catch (e) {
      logger.error(`registerPath(${sourceAndPath}): error adding tag: ${tag}: ${e}`)
    }
  }
  logger.debug(`${logPrefix} FINISHED`)
  return meta
}

/*
 * When a path is unregistered:
 * - The path index file is removed: indexes/paths/<3-sha-hash-dirs-of-dirname(path)>/<full-sha-of-sourceAndPath>
 * - All tag index files for the content are removed
 */
const unregisterPath = async (sourceAndPath) => {
  const pathIndex = getPathIndex(sourceAndPath)
  await system.api.remove(pathIndex)
  await removeAllTagsForPath(sourceAndPath)
}

const normalizeTag = tag => tag.toLowerCase().replaceAll(/[\W_]+/g, '-')
const denormalizeTag = normTag => normTag.replaceAll('-', ' ')

const tagDir = (tag) => {
  const normTag = normalizeTag(tag)
  const tagSha = shasum(normTag)
  return `${TAG_TO_CONTENT_INDEX}${tagSha.substring(0, 2)}/${tagSha.substring(2, 4)}/${tagSha.substring(4, 6)}/${normTag}/`
}

const tagsForPathDir = (sourceAndPath) => {
  const hash = shasum(sourceAndPath)
  return `${CONTENT_TO_TAG_INDEX}${hash.substring(0, 2)}/${hash.substring(2, 4)}/${hash.substring(4, 6)}/${hash}/`
}

/**
 * * When adding a tag to a path:
 *   * The encoded path file is touched: indexes/tags/tagsToContent/<3-sha-hash-dirs-of-tag-name>/<full-sha-of-tag>/<encoded-path>
 *   * The tag file is touched: indexes/tags/contentToTags/<3-sha-hash-dirs-of-sourceAndPath>/<full-sha-of-sourceAndPath>/<tag>
 */
const addTag = async (sourceAndPath, tag) => {
  if (Array.isArray(tag)) {
    for (const t of tag) {
      await addTag(sourceAndPath, t)
    }
    return
  }
  const normTag = normalizeTag(tag)
  const logPrefix = `addTag(${sourceAndPath}, ${tag})`
  if (normTag.length < MIN_TAG_LENGTH) {
    logger.warn(`${logPrefix} tag is shorter than MIN_TAG_LENGTH (${MIN_TAG_LENGTH}), not adding`)
    return
  }
  if (isAllDigitsOrNonWordChars(normTag)) {
    logger.warn(`${logPrefix} tag is all digits and/or non-word chars, not adding`)
    return
  }
  if (stopWords().includes(normTag) || stopWords().includes(tag)) {
    logger.warn(`${logPrefix} tag is a stopword, not adding`)
    return
  }
  const encodedPath = objectEncodePath(sourceAndPath)

  const tagToContentPath = `${tagDir(tag)}${encodedPath}`
  const tagToContentMeta = await system.api.safeMetadata(tagToContentPath)
  if (!tagToContentMeta) {
    logger.info(`${logPrefix} writing tagToContentPath=${tagToContentPath}`)
    await system.api.writeFile(tagToContentPath, '~')
  } else {
    logger.info(`${logPrefix} tagToContentPath already exists: ${tagToContentPath}`)
  }

  const contentToTagPath = `${tagsForPathDir(sourceAndPath)}${normTag}`
  const contentToTagMeta = await system.api.safeMetadata(contentToTagPath)
  if (!contentToTagMeta) {
    logger.info(`${logPrefix} writing contentToTagPath=${contentToTagPath}`)
    await system.api.writeFile(contentToTagPath, '~')
  } else {
    logger.info(`${logPrefix} contentToTagPath already exists: ${contentToTagPath}`)
  }
  await flushTagsForPathCache(sourceAndPath)
}

const removeTag = async (sourceAndPath, tag) => {
  if (Array.isArray(tag)) {
    for (const t of tag) {
      await removeTag(sourceAndPath, t)
    }
    return
  }
  const logPrefix = `removeTag(${sourceAndPath}, ${tag})`
  const encodedPath = objectEncodePath(sourceAndPath)

  const tagToContentPath = `${tagDir(tag)}${encodedPath}`
  logger.info(`${logPrefix} removing tagToContentPath=${tagToContentPath}`)
  if (!(await system.api.remove(tagToContentPath, { quiet: true }))) {
    logger.warn(`${logPrefix} error removing tagToContentPath=${tagToContentPath}`)
  }

  const contentToTagPath = `${tagsForPathDir(sourceAndPath)}${normalizeTag(tag)}`
  logger.info(`${logPrefix} removing contentToTagPath=${contentToTagPath}`)
  if (!(await system.api.remove(contentToTagPath, { quiet: true }))) {
    logger.warn(`${logPrefix} error removing contentToTagPath=${contentToTagPath}`)
  }
  await flushTagsForPathCache(sourceAndPath)
}

const removeAllTagsForPath = async (sourceAndPath) => {
  const logPrefix = `removeAllTagsForPath(${sourceAndPath})`
  const encodedPath = objectEncodePath(sourceAndPath)
  const tagsDir = tagsForPathDir(sourceAndPath)
  const tags = await system.api.list(tagsDir, { recursive: true, quiet: true })
  if (tags && tags.length > 0) {
    const tagNames = tags.map(obj => basename(obj.name))
    for (const tag of tagNames) {
      const tagToContentPath = `${tagDir(tag)}${encodedPath}`
      logger.info(`${logPrefix} removing tagToContentPath=${tagToContentPath}`)
      if (!(await system.api.remove(tagToContentPath, { quiet: true }))) {
        logger.warn(`${logPrefix} error removing tagToContentPath=${tagToContentPath}`)
      }
    }
    logger.info(`${logPrefix} recursively removing tagsDir=${tagsDir}`)
    if (!(await system.api.remove(tagsDir, { recursive: true, quiet: true }))) {
      logger.warn(`${logPrefix} error removing tagsDir=${tagsDir}`)
    }
  }
  await flushTagsForPathCache(sourceAndPath)
}

const TAGS_FOR_PATH_CACHE_PREFIX = 'getTagsForPath_'
const PATHS_WITH_TAG_CACHE_PREFIX = 'getPathsWithTag_'
const TAG_CACHE_EXPIRATION = 1000 * 60 * 60 * 24

const getTagsForPath = async (sourceAndPath) => {
  const hash = shasum(sourceAndPath)
  const cacheKey = TAGS_FOR_PATH_CACHE_PREFIX + hash
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  const contentToTagPath = tagsForPathDir(sourceAndPath)
  const tagObjs = await system.api.list(contentToTagPath)
  const tags = tagObjs.map(o => denormalizeTag(basename(o.name)))
  await redis.set(cacheKey, JSON.stringify(tags), TAG_CACHE_EXPIRATION)
  return tags
}

const flushTagsForPathCache = async (sourceAndPath) => {
  const hash = shasum(sourceAndPath)
  const cacheKey = TAGS_FOR_PATH_CACHE_PREFIX + hash
  await redis.del(cacheKey)
}

const Queue = require('bull')
const LRU = require('lru-cache')
const redisConfig = system.privateConfig.redis

const PATHS_WITH_TAG_QUEUE_NAME = 'PathsWithTagQueue'
const PATHS_WITH_TAG_JOB_NAME = 'PathsWithTagJob'
const PATHS_WITH_TAG_CONCURRENCY = 1

const queuedPathsLRU = new LRU({ max: 1000 })

const PATHS_WITH_TAG_PROCESS_FUNCTION = async (job) => {
  // const asset = job.data.asset
  const normTag = job.data.normTag
  const cacheKey = job.data.cacheKey
  const logPrefix = `PATHS_WITH_TAG_PROCESS_FUNCTION(${normTag})`
  try {
    const dir = tagDir(normTag)
    logger.info(`${logPrefix} recursively listing tagDir: ${dir}`)
    const encodedPathObjs = await system.api.list(dir, { recursive: true })
    logger.info(`${logPrefix} found ${encodedPathObjs ? encodedPathObjs.length : 'undefined?'} paths in: ${dir}`)
    const paths = encodedPathObjs.map(o => objectDecodePath(basename(o.name)))
    await redis.set(cacheKey, JSON.stringify(paths), TAG_CACHE_EXPIRATION)
    queuedPathsLRU.set(normTag, paths)
    logger.info(`${logPrefix} returning ${paths.length} paths`)
    return paths
  } catch (e) {
    logger.error(`${logPrefix} error: ${e}`)
    throw e
  }
}

let PATHS_WITH_TAG_QUEUE = null
const pathsWithTagQueue = () => {
  if (PATHS_WITH_TAG_QUEUE === null) {
    PATHS_WITH_TAG_QUEUE = new Queue(PATHS_WITH_TAG_QUEUE_NAME, `redis://${redisConfig.host}:${redisConfig.port}`)
    PATHS_WITH_TAG_QUEUE.process(PATHS_WITH_TAG_JOB_NAME, PATHS_WITH_TAG_CONCURRENCY, PATHS_WITH_TAG_PROCESS_FUNCTION)
  }
  return PATHS_WITH_TAG_QUEUE
}

function queuePathsForTag (normTag, cacheKey) {
  const job = {
    ctime: Date.now(),
    normTag,
    cacheKey
  }
  pathsWithTagQueue().add(PATHS_WITH_TAG_JOB_NAME, job)
}

const cache_enabled = true
const getPathsWithTag = async (tag) => {
  const normTag = normalizeTag(tag)
  const lruCached = queuedPathsLRU.get(normTag)
  if (lruCached) {
    if (Array.isArray(lruCached)) {
      logger.debug(`getPathsWithTag(${tag}) found in LRU, returning ${lruCached.length} paths`)
      return lruCached
    } else {
      logger.debug(`getPathsWithTag(${tag}) marked as processing in LRU, not queueing...`)
      return [INDEX_STILL_BUILDING_TOKEN]
    }
  }
  const cacheKey = PATHS_WITH_TAG_CACHE_PREFIX + normTag
  const cached = cache_enabled ? await redis.get(cacheKey) : null
  if (cached) {
    return JSON.parse(cached)
  } else {
    logger.debug(`getPathsWithTag(${tag}) not in LRU, queueing and returning still-building`)
    queuedPathsLRU.set(normTag, true)
    queuePathsForTag(normTag, cacheKey)
  }
  return [INDEX_STILL_BUILDING_TOKEN]
}

const TAG_PATH_REGEX = new RegExp('^' + TAG_TO_CONTENT_INDEX + '[\\dA-F]{2}/[\\dA-F]{2}/[\\dA-F]{2}/[^/]{3,}/?', 'gi')

const forAllTags = async (func) => {
  const tags = new Set()
  const visitor = async (obj) => {
    logger.debug(`forAllTags: visiting object: ${JSON.stringify(obj)}`)
    // are we at the correct depth?
    const match = obj.name.match(TAG_PATH_REGEX)
    if (match) {
      const tag = basename(match[0])
      if (!tags.has(tag)) {
        tags.add(tag)
        logger.debug(`forAllTags: found tag: ${tag}`)
        await func(tag)
      }
    } else {
      logger.info(`not a tag: ${obj.name}`)
    }
  }
  const listing = await system.api.safeList(TAG_TO_CONTENT_INDEX, { recursive: true, visitor })
  logger.debug(`forAllTags: safeList returned ${listing.length} objects`)
  return [...tags]
}

export {
  registerPath, addTag, removeTag, tagDir, forAllTags,
  getTagsForPath, getPathsWithTag, pathRegistrationAge
}
