const shasum = require('shasum')
const s3 = require('@aws-sdk/client-s3')
const nuxt = require('../../nuxt.config').default
const m = require('../../shared/media')
const src = require('../../shared/source')
const crypt = require('../util/crypt')
const q = require('../util/query')
const s3util = require('../s3/s3util')

const USER_ENC_KEY = nuxt.privateRuntimeConfig.userEncryption.key

function SourceError (source) {
  this.message = source
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
}

function SourceNotFoundError (source) {
  this.message = source
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
}

function sourceStorePrefix (key = USER_ENC_KEY) {
  return `sources_${shasum(`sources:${key}`)}/`
}

function searchMatches (source, searchTerms) {
  return (source.name && source.name.includes(searchTerms))
}

async function sourceExists (name, key) {
  const sourceHead = await s3util.headDestObject(sourceKey(name, key))
  return sourceHead && sourceHead.ContentLength && sourceHead.ContentLength > 0
}

async function findSource (name, key = USER_ENC_KEY) {
  try {
    return await s3util.readDestTextObject(sourceKey(name, key))
  } catch (e) {
    if (e instanceof s3.NoSuchKey) {
      throw new SourceNotFoundError(name)
    }
    throw e
  }
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

function sourceKey (source, key = USER_ENC_KEY) {
  return sourceStorePrefix(key) + source.name
}

async function createSource (source, key = USER_ENC_KEY) {
  if (await sourceExists(source.name)) {
    throw new SourceError(`createSource: source exists: ${source.name}`)
  }
  const bucketParams = {
    Key: sourceKey(source, key),
    Body: JSON.stringify(source)
  }
  return await s3util.destPut(bucketParams, 'error writing source')
}

async function deleteSource (name, key = USER_ENC_KEY) {
  if (!(await sourceExists(name))) {
    throw new SourceError(`deleteSource: source does not exist: ${name}`)
  }
  return await s3util.deleteDestObject(sourceKey(name, key))
}

export {
  sourceExists, findSource, listSources, createSource, deleteSource,
  SourceError, SourceNotFoundError
}
