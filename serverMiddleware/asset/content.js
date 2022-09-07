const shasum = require('shasum')
const { dirname, basename } = require('path')
const { chopFileExt, isAllDigitsOrNonWordChars } = require('../../shared')
const { extractSourceAndPath } = require('../../shared/source')
const { mediaType, objectEncodePath, objectDecodePath } = require('../../shared/media')
const { MEDIAINFO_FIELDS, mediaInfoFields } = require('../../shared/mediainfo')
const { stopWords } = require('../../shared/locale')
const system = require('../util/config').SYSTEM
const logger = system.logger
const redis = require('../util/redis')
const { deriveMediaInfo, deriveMetadataFromSourceAndPath } = require('./manifest')

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
  // write to path index
  const pathIndex = getPathIndex(sourceAndPath)
  await system.api.writeFile(pathIndex, JSON.stringify(meta))

  // start with fresh set of tags
  const logPrefix = `registerPath(${sourceAndPath})`
  logger.debug(`${logPrefix} removing all tags`)
  await removeAllTagsForPath(sourceAndPath)

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

  // add tags
  logger.debug(`${logPrefix} adding tags: ${JSON.stringify(tagsToAdd)}`)
  for (const tag of tagsToAdd) {
    try {
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

const normalizeTag = tag => tag.toLowerCase().replaceAll(/\W+/g, '-')
const denormalizeTag = normTag => normTag.replaceAll('-', ' ')

const tagDir = (tag) => {
  const normTag = normalizeTag(tag)
  const tagSha = shasum(normTag)
  return `${TAG_TO_CONTENT_INDEX}${tagSha.substring(0, 2)}/${tagSha.substring(2, 4)}/${tagSha.substring(4, 6)}/`
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
  const normTag = normalizeTag(tag)
  if (normTag.length < MIN_TAG_LENGTH) {
    logger.warn(`addTag(${sourceAndPath}, ${tag}): tag is shorter than MIN_TAG_LENGTH (${MIN_TAG_LENGTH}), not adding`)
    return
  }
  if (isAllDigitsOrNonWordChars(normTag)) {
    logger.warn(`addTag(${sourceAndPath}, ${tag}): tag is all digits and/or non-word chars, not adding`)
    return
  }
  if (stopWords().includes(normTag) || stopWords().includes(tag)) {
    logger.warn(`addTag(${sourceAndPath}, ${tag}): tag is a stopword, not adding`)
    return
  }
  const encodedPath = objectEncodePath(sourceAndPath)

  const tagToContentPath = `${tagDir(tag)}${encodedPath}`
  await system.api.writeFile(tagToContentPath, '~')

  const contentToTagPath = `${tagsForPathDir(sourceAndPath)}/${normTag}`
  await system.api.writeFile(contentToTagPath, '~')
}

const removeTag = async (sourceAndPath, tag) => {
  const encodedPath = objectEncodePath(sourceAndPath)

  const tagToContentPath = `${tagDir(tag)}${encodedPath}`
  await system.api.remove(tagToContentPath, { quiet: true })

  const contentToTagPath = `${tagsForPathDir(sourceAndPath)}/${normalizeTag(tag)}`
  await system.api.remove(contentToTagPath, { quiet: true })
}

const removeAllTagsForPath = async (sourceAndPath) => {
  const encodedPath = objectEncodePath(sourceAndPath)
  const tagsDir = tagsForPathDir(sourceAndPath)
  const tags = await system.api.list(tagsDir, { recursive: true })
  if (tags && tags.length > 0) {
    const tagNames = tags.map(obj => basename(obj.name))
    for (const tag of tagNames) {
      const tagToContentPath = `${tagDir(tag)}${encodedPath}`
      await system.api.remove(tagToContentPath, { quiet: true })
    }
    await system.api.remove(tagsDir, { recursive: true, quiet: true })
  }
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

const cache_enabled = true
const getPathsWithTag = async (tag) => {
  const normTag = normalizeTag(tag)
  const cacheKey = PATHS_WITH_TAG_CACHE_PREFIX + normTag
  const cached = cache_enabled ? await redis.get(cacheKey) : null
  if (cached) {
    return JSON.parse(cached)
  }
  const encodedPathObjs = await system.api.list(tagDir(normTag), { recursive: true })
  const paths = encodedPathObjs.map(o => objectDecodePath(basename(o.name)))
  await redis.set(cacheKey, JSON.stringify(paths), TAG_CACHE_EXPIRATION)
  return paths
}

export {
  registerPath, addTag, removeTag, tagDir,
  getTagsForPath, getPathsWithTag
}
