const Redis = require('ioredis')
const generators = require('redis-async-gen')
const system = require('./config.js').SYSTEM
const logger = system.logger

const redisConfig = system.privateConfig.redis

const redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port
})
const DEFAULT_EXPIRATION_MILLIS = 1000 * 60 * 60 * 24 * 30 // 30 days

const get = async key => await redisClient.get(key)

const getJson = async (key) => {
  const json = await redisClient.get(key)
  return json ? JSON.parse(json) : null
}

async function set (key, val, expirationMillis = DEFAULT_EXPIRATION_MILLIS) {
  await redisClient.set(key, val, 'EX', expirationMillis / 1000)
}

async function sadd (key, val) {
  await redisClient.sadd(key, val)
}

async function expire (key, expirationMillis) {
  await redisClient.expire(key, expirationMillis / 1000)
}

function smembers (key) {
  return redisClient.smembers(key)
}

async function del (key) {
  await redisClient.del(key)
}

async function flushall () {
  await redisClient.flushall()
}

async function findMatchingKeys (pattern) {
  const { keysMatching } = generators.using(redisClient)
  const keys = []
  for await (const key of keysMatching(pattern)) {
    keys.push(key)
  }
  return keys
}

async function removeMatchingKeys (pattern) {
  return await applyToMatchingKeys(pattern, del)
}

async function applyToMatchingKeys (pattern, asyncFunc) {
  const { keysMatching } = generators.using(redisClient)
  const results = []
  for await (const key of keysMatching(pattern)) {
    results.push(await asyncFunc(key))
  }
  return results
}

setTimeout(() => {
  if (redisConfig.flushAtStartup) {
    // start with an empty redis
    flushall().then(
      () => { logger.info(' ***** redis: FLUSHED *****') },
      (err) => {
        if (err) { logger.error(` ***** redis: ERROR calling flushall: ${err}`) }
      })
  }
}, 10)

module.exports = {
  get,
  getJson,
  set,
  del,
  expire,
  sadd,
  smembers,
  flushall,
  findMatchingKeys,
  removeMatchingKeys,
  applyToMatchingKeys
}
