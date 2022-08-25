
const { mobiletto, MobilettoNotFoundError, setLogLevel } = require('mobiletto')
const c = require('../../shared')
const m = require('../../shared/media')
const s = require('../../shared/source')
const q = require('../util/query')
const system = require('../util/config').SYSTEM

setLogLevel('silly')

const SOURCES_PREFIX = 'sources/'
const sourceKey = name => name.startsWith(SOURCES_PREFIX) ? name : SOURCES_PREFIX + name + '.json'

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
  return (source.name && (source.name.includes(searchTerms) || source.name === c.SELF_SOURCE_NAME))
}

async function sourceExists (name) {
  const meta = await system.api.safeMetadata(sourceKey(name))
  return meta ? meta.name : false
}

async function findSource (name) {
  if (name === c.SELF_SOURCE_NAME) {
    return system.source
  }
  try {
    return JSON.parse((await system.api.readFile(sourceKey(name))).toString())
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
  // push special source: self (dest)
  allSources.push(system.source)
  return q.search(allSources, query, searchMatches, s.sortByField)
}
async function connectSource (source) {
  // determine readOnly (default true) and options
  const readOnly = typeof source.readOnly === 'boolean' ? source.readOnly : true
  const opts = Object.assign({}, source.opts || {}, { readOnly })

  // determine encryption
  const enc = source.encryption && source.encryption.key ? source.encryption : null

  // test connection
  return await mobiletto(source.type, source.key, source.secret, opts, enc)
}

async function createSource (source) {
  if (!source || !source.name) {
    throw new SourceError(`createSource: no name for source: ${JSON.stringify(source)}`)
  }
  if (await sourceExists(source.name)) {
    throw new SourceError(`createSource: source exists: ${source.name}`)
  }

  // test connection
  await connectSource(source)

  // save source
  const now = Date.now()
  const sourceRecord = Object.assign({}, source, { ctime: now, mtime: now })
  return await system.api.writeFile(sourceKey(source.name), JSON.stringify(sourceRecord))
}

async function deleteSource (name) {
  if (name === c.SELF_SOURCE_NAME) {
    throw new SourceError(`deleteSource: cannot delete self: ${name}`)
  }
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
  SOURCE_APIS[name] = await connectSource(source)
  SOURCE_APIS[name].name = name
  return SOURCE_APIS[name]
}

const connectedSources = () => Object.keys(SOURCE_APIS)

async function extractSourceAndPathAndConnect (from) {
  const { sourceName, pth } = s.extractSourceAndPath(from)
  const source = await connect(sourceName)
  source.name = sourceName
  return { source, pth }
}

export {
  connect, connectedSources, extractSourceAndPathAndConnect,
  sourceExists, findSource, listSources, createSource, deleteSource,
  SourceError, SourceNotFoundError
}
