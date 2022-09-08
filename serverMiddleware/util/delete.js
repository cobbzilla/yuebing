const Queue = require('bull')
const system = require('./config').SYSTEM
const logger = system.logger

const redisConfig = system.privateConfig.redis

const DELETE_QUEUE_NAME = 'DeletePathQueue'
const DELETE_JOB_NAME = 'DeletePathJob'
const DELETE_CONCURRENCY = 2

const DELETE_PROCESS_FUNCTION = async (job) => {
  const asset = job.data.asset
  try {
    const removed = job.data.recursive
      ? await system.api.remove(asset, { recursive: true })
      : await system.api.remove(asset)
    if (!removed) {
      logger.warn(`DELETE_PROCESS_FUNCTION: error removing asset ${asset}: removed returned falsy`)
    }
  } catch (e) {
    logger.error(`DELETE_PROCESS_FUNCTION: error removing asset ${asset}: ${e}`)
    throw e
  }
}

let DELETE_QUEUE = null
const deleteQueue = () => {
  if (DELETE_QUEUE === null) {
    DELETE_QUEUE = new Queue(DELETE_QUEUE_NAME, `redis://${redisConfig.host}:${redisConfig.port}`)
    DELETE_QUEUE.process(DELETE_JOB_NAME, DELETE_CONCURRENCY, DELETE_PROCESS_FUNCTION)
  }
  return DELETE_QUEUE
}

function queueSystemDelete (asset, opts) {
  const job = {
    ctime: Date.now(),
    asset,
    recursive: opts && opts.recursive
  }
  deleteQueue().add(DELETE_JOB_NAME, job)
}

export { queueSystemDelete }
