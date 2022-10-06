const Redis = require('ioredis')
const redisScan = require('node-redis-scan')
const system = require('./config.js').SYSTEM
const logger = system.logger

const redisConfig = () => system.privateConfig.redis

let _redisClient = null
const redisClient = () => {
  if (_redisClient === null) {
    const cfg = redisConfig() || {}
    _redisClient = new Redis({
      host: cfg.host || '127.0.0.1',
      port: cfg.port || 6379
    })
  }
  return _redisClient
}

let _scanner = null
const scanner = () => {
  if (_scanner === null) {
    _scanner = new redisScan(redisClient())
  }
  return _scanner
}

const DEFAULT_EXPIRATION_MILLIS = 1000 * 60 * 60 * 24 * 30 // 30 days

const get = async key => await redisClient().get(key)

const getJson = async (key) => {
  const json = await redisClient().get(key)
  return json ? JSON.parse(json) : null
}

async function set (key, val, expirationMillis = DEFAULT_EXPIRATION_MILLIS) {
  await redisClient().set(key, val, 'EX', expirationMillis / 1000)
}

async function sadd (key, val) {
  await redisClient().sadd(key, Array.isArray(val) ? val : [val])
}

async function srem (key, val) {
  await redisClient().srem(key, Array.isArray(val) ? val : [val])
}

async function expire (key, expirationMillis) {
  await redisClient().expire(key, expirationMillis / 1000)
}

async function smembers (key) {
  const members = await redisClient().smembers(key)
  return members ? members : []
}

async function del (key) {
  await redisClient().del(key)
}

async function flushall () {
  await redisClient().flushall()
}

async function findMatchingKeys (pattern) {
  return await new Promise((resolve, reject) => {
    scanner().scan(pattern, (err, matchingKeys) => {
      if (err) reject(err)
      resolve(matchingKeys)
    })
  })
}

async function removeMatchingKeys (pattern) {
  return await applyToMatchingKeys(pattern, del)
}

async function applyToMatchingKeys (pattern, asyncFunc) {
  const results = []
  return await new Promise((resolve, reject) => {
    scanner().eachScan(pattern, {}, async (matchingKeys) => {
      for (const key of matchingKeys) {
        results.push(await asyncFunc(key))
      }
    }, (err, matchCount) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}

setTimeout(() => {
  if (redisConfig().flushAtStartup) {
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
  srem,
  smembers,
  flushall,
  findMatchingKeys,
  removeMatchingKeys,
  applyToMatchingKeys
}
