import shasum from 'shasum'

const nuxt = require('../../nuxt.config').default
const m = require('../../shared/media')
const src = require('../../shared/source')
const crypt = require('../util/crypt')
const q = require('../util/query')
const s3util = require('../s3/s3util')

const USER_ENC_KEY = nuxt.privateRuntimeConfig.userEncryption.key

function sourceStorePrefix (key = USER_ENC_KEY) {
  return `sources_${shasum(`sources:${key}`)}/`
}

function searchMatches (source, searchTerms) {
  return (source.name && source.name.includes(searchTerms))
}

async function listSources (query) {
  const objectList = await s3util.listDest('/' + sourceStorePrefix())
  const allSources = []
  for (const object of objectList) {
    if (object.type === m.FILE_TYPE) {
      allSources.push(JSON.parse(crypt.decrypt(await s3util.readDestTextObject(object.name))))
    }
  }
  return q.search(allSources, query, searchMatches, src.sortByField)
}

export { listSources }
