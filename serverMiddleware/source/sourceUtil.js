
const { mobiletto, MobilettoNotFoundError } = require('mobiletto')
const m = require('../../shared/media')
const s = require('../../shared/source')
const q = require('../util/query')
const system = require('../util/config').SYSTEM

const SOURCES_PREFIX = 'sources/'
const sourceKey = name => SOURCES_PREFIX + name

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

function searchMatches (source, searchTerms) {
  return (source.name && source.name.includes(searchTerms))
}

async function sourceExists (name) {
  try {
    return await system.api.metadata(sourceKey(name)).name
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      return false
    }
    throw e
  }
}

async function findSource (name) {
  try {
    return await system.api.readFile(sourceKey(name))
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      throw new SourceNotFoundError(name)
    }
    throw e
  }
}

async function listSources (query) {
  const objectList = await system.api.list(SOURCES_PREFIX)
  const allSources = []
  for (const object of objectList) {
    if (object.type === m.FILE_TYPE) {
      allSources.push(JSON.parse(await system.api.readFile(object.name)))
    }
  }
  return q.search(allSources, query, searchMatches, s.sortByField)
}

async function createSource (source) {
  if (!source || !source.name) {
    throw new SourceError(`createSource: no name for source: ${JSON.stringify(source)}`)
  }
  if (await sourceExists(source.name)) {
    throw new SourceError(`createSource: source exists: ${source.name}`)
  }
  if (!source.config) {
    throw new SourceError(`createSource: no config for ${source.name}`)
  }
  const opts = Object.assign({}, source.config.opts || {}, { readOnly: true })

  // test connection
  await mobiletto(source.type, source.config.key, source.config.secret, opts)

  // save source
  return await system.api.writeFile(sourceKey(source.name), JSON.stringify(source))
}

async function deleteSource (name) {
  if (!(await sourceExists(name))) {
    throw new SourceError(`deleteSource: source does not exist: ${name}`)
  }
  return await system.api.remove(sourceKey(name))
}

const SOURCE_APIS = {}

async function connect (name) {
  if (!name) {
    throw new TypeError('no source name')
  }
  if (SOURCE_APIS[name]) {
    return SOURCE_APIS[name]
  }
  const source = await findSource(name)
  SOURCE_APIS[name] = await mobiletto(source.type, source.config.key, source.config.secret, source.config.opts)
  return SOURCE_APIS[name]
}

const connectedSources = () => Object.keys(SOURCE_APIS)

async function extractSourceAndPathAndConnect (from) {
  const { sourceName, path } = s.extractSourceAndPath(from)
  const source = await connect(sourceName)
  return { source, path }
}

export {
  connect, connectedSources, extractSourceAndPathAndConnect,
  sourceExists, findSource, listSources, createSource, deleteSource,
  SourceError, SourceNotFoundError
}