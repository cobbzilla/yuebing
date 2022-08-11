// adapted from https://stackoverflow.com/a/64136185
const crypto = require('crypto')
const shasum = require('shasum')
const nuxt = require('../../nuxt.config')

const MIN_KEY_LEN = 16

function normalizeKey (k) {
  return (typeof k === 'string' && k.trim().length > MIN_KEY_LEN)
    ? Buffer.from(shasum(k)).subarray(0, 32)
    : null
}

function normalizeIV (iv, key) {
  return (typeof iv === 'string')
    ? Buffer.from(shasum(iv)).subarray(0, 16)
    : key
      ? Buffer.from(shasum(key)).subarray(0, 16)
      : null
}

// ensure key long enough for security, and is 32 bytes for AES-256
const rawKey = nuxt.default.privateRuntimeConfig.userEncryption.key
const KEY = normalizeKey(rawKey)

// ensure IV is 16 bytes for AES-256
const rawIV = nuxt.default.privateRuntimeConfig.userEncryption.iv
const CRYPTO_IV = normalizeIV(rawIV, KEY)

if (!KEY) {
  console.warn(` ****** SV_USERDATA_KEY env var (value=${rawKey}) is undefined or less than the minimum ${MIN_KEY_LEN} chars, encryption of user-data is DISABLED`)
}

function encrypt (plainText, key = KEY, iv = CRYPTO_IV, outputEncoding = 'base64') {
  if (!key) {
    return plainText
  }
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding)
}

function decrypt (cipherText, key = KEY, iv = CRYPTO_IV, outputEncoding = 'utf8') {
  if (!key) {
    return cipherText
  }
  const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  const data = Buffer.from(cipherText, 'base64')
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(outputEncoding)
}

export { encrypt, decrypt, normalizeKey, normalizeIV }
