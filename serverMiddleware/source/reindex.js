const Queue = require('bull')

const { extractSourceAndPath } = require('../../shared/source')
const { hasProfiles } = require('../../shared/media')
const { connect } = require('./sourceUtil')
const { deriveMetadataFromSourceAndPath } = require('../asset/manifest')
const system = require('../util/config').SYSTEM
const logger = system.logger
const redis = require('../util/redis')
const { registerPath } = require('../asset/content')

const REINDEX_INFO_SET_KEY = 'reindex_info_'
const REINDEX_INFO_EXPIRATION = 1000 * 60 * 60 * 24
const REINDEX_QUEUE_NAME = 'reindex_queue'
const REINDEX_JOB_NAME = 'reindex_job'

const redisConfig = system.privateConfig.redis

const REINDEX_PROCESS_FUNCTION = async (job) => {
  const source = job.data.source
  const sourceAndPath = source + '/' + job.data.path
  const logPrefix = `reindex(${source})`
  const infoSetKey = REINDEX_INFO_SET_KEY + source
  let expirationSet = false
  await new Promise((resolve, reject) => {
    deriveMetadataFromSourceAndPath(sourceAndPath, { noCache: true }).then(
      (meta) => {
        logger.info(`${logPrefix} deriveMetadataFromSourceAndPath returned meta: ${JSON.stringify(meta)}`)
        if (meta.finished || (meta.status && meta.status.ready)) {
          registerPath(sourceAndPath, meta).then(() => {
              logger.info(`${logPrefix} registered path: ${sourceAndPath}, calling redis.sadd`)
              redis.sadd(infoSetKey, `${sourceAndPath}\t${Date.now()}\tsuccess`).then(() => {
                  if (!expirationSet) {
                    expirationSet = true
                    redis.expire(infoSetKey, REINDEX_INFO_EXPIRATION)
                  }
                  logger.info(`${logPrefix} RESOLVED: ${sourceAndPath}`)
                  resolve(meta)
                },
                (err) => {
                  const message = `${logPrefix} error calling redis.sadd(${infoSetKey}) for ${sourceAndPath}: ${err}`
                  logger.error(message)
                  reject(message)
                })
            },
            (err) => {
              const message = `${logPrefix} error calling registerPath for ${sourceAndPath}: ${JSON.stringify(err)}`
              logger.error(message)
              reject(message)
            })
        }
      },
      (err) => {
        logger.error(`${logPrefix} error loading metadata for path: ${sourceAndPath}: ${err}`)
        redis.sadd(infoSetKey, `${sourceAndPath}\t${Date.now()}\t${err}`).then(() => {
          if (!expirationSet) {
            expirationSet = true
            redis.expire(infoSetKey, REINDEX_INFO_EXPIRATION)
          }
          reject(err)
        })
      })
  })
}

let QUEUE = null
const indexQueue = () => {
  if (QUEUE === null) {
    QUEUE = new Queue(REINDEX_QUEUE_NAME, `redis://${redisConfig.host}:${redisConfig.port}`)
    QUEUE.process(REINDEX_JOB_NAME, 1, REINDEX_PROCESS_FUNCTION)
  }
  return QUEUE
}

function enqueue (source, path) {
  const job = {
    ctime: Date.now(),
    source,
    path
  }
  indexQueue().add(REINDEX_JOB_NAME, job)
}

const reindex = async (source) => {
  const indexer = (obj) => {
    if (hasProfiles(obj.name)) {
      enqueue(source, obj.name)
    }
  }
  const api = await connect(source)
  api.list('', { recursive: true, visitor: indexer })
}

const reindexPath = async (sourceAndPath) => {
  const { sourceName, pth } = extractSourceAndPath(sourceAndPath)
  enqueue(sourceName, pth)
}

const reindexInfo = async source => (await redis.smembers(REINDEX_INFO_SET_KEY + source))
  .map(m => {
    const parts = m.split('\t')
    return {
      sourceAndPath: parts[0],
      ctime: parts[1],
      status: parts[2]
    }})
  .sort((o1, o2) => o1.ctime - o2.ctime)

export { reindex, reindexPath, reindexInfo }
