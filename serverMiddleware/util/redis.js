const Redis = require('ioredis')
const generators = require('redis-async-gen')
const config = require('./config.js')
const SYSTEM = config.SYSTEM

const redisConfig = SYSTEM.privateConfig.redis

const redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port
})
const DEFAULT_EXPIRATION_MILLIS = 1000 * 60 * 60 * 24 * 30 // 30 days

function get (key) {
  return redisClient.get(key)
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

setTimeout(() => {
  if (redisConfig.flushAtStartup) {
    // start with an empty redis
    flushall().then(
      () => { console.log(' ***** redis: FLUSHED *****') },
      (err) => {
        if (err) { console.error(` ***** redis: ERROR calling flushall: ${err}`) }
      })
  }
}, 10)

module.exports = { get, set, del, expire, sadd, smembers, flushall, findMatchingKeys }
