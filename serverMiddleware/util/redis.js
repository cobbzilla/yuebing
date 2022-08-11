const Redis = require('ioredis')
const nuxt = require('../../nuxt.config').default

const redisConfig = nuxt.privateRuntimeConfig.redis

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

async function del (key) {
  await redisClient.del(key)
}

async function flushall () {
  await redisClient.flushall()
}

if (redisConfig.flushAtStartup) {
  // start with an empty redis
  flushall().then(
    () => {
      console.log(' ***** redis: FLUSHED *****')
    },
    (err) => {
      if (err) {
        console.error(` ***** redis: ERROR calling flushall: ${err}`)
      }
    })
}

export { get, set, del, flushall }
