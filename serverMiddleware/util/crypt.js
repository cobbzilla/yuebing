// adapted from https://stackoverflow.com/a/64136185
const crypto = require('crypto')
const shasum = require('shasum')
const nuxt = require('../../nuxt.config')

const MIN_KEY_LEN = 16

// ensure key long enough for security, and is 32 bytes for AES-256
const rawKey = nuxt.default.privateRuntimeConfig.userEncryptionKey
const KEY = (typeof rawKey === 'string' && rawKey.trim().length > MIN_KEY_LEN)
  ? Buffer.from(shasum(rawKey)).subarray(0, 32)
  : null

// ensure IV is 16 bytes for AES-256
const rawIV = nuxt.default.privateRuntimeConfig.userEncryptionIV
const CRYPTO_IV = (typeof rawIV === 'string')
  ? Buffer.from(shasum(rawIV)).subarray(0, 16)
  : KEY
    ? Buffer.from(shasum(KEY)).subarray(0, 16)
    : null

if (!KEY) {
  console.warn(` ****** SV_USERDATA_KEY env var (value=${rawKey}) is undefined or less than the minimum ${MIN_KEY_LEN} chars, encryption of user-data is DISABLED`)
}

function encrypt (plainText, key = KEY, outputEncoding = 'base64') {
  if (!KEY) {
    return plainText
  }
  const cipher = crypto.createCipheriv('aes-256-cbc', key, CRYPTO_IV)
  return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding)
}

function decrypt (cipherText, key = KEY, outputEncoding = 'utf8') {
  if (!KEY) {
    return cipherText
  }
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, CRYPTO_IV)
  const data = Buffer.from(cipherText, 'base64')
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(outputEncoding)
}

export { encrypt, decrypt }
