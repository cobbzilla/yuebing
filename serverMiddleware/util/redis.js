const Redis = require('ioredis')

const redisClient = new Redis({
  host: '127.0.0.1',
  port: 6379
})

const DEFAULT_EXPIRATION = 1000 * 60 * 60 * 24 * 30 // 30 days

function get (key) {
  return redisClient.get(key)
}

async function set (key, val, expiration = DEFAULT_EXPIRATION) {
  await redisClient.set(key, val, 'EX', expiration)
}

async function del (key) {
  await redisClient.del(key)
}

export { get, set, del }
