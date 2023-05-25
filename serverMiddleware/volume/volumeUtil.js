const LRU = require('lru-cache')
const shasum = require('shasum')
const {
  mobiletto, MobilettoError, MobilettoNotFoundError
} = require('mobiletto-lite')
const c = require('../../shared')
const m = require('../../shared/media')
const vol = require('../../shared/volume')
const q = require('../util/query')
const system = require('../util/config').SYSTEM
const logger = system.logger

const VOLUME_PREFIX = 'volumes/'
const volumeKey = name => name.startsWith(VOLUME_PREFIX) ? name : VOLUME_PREFIX + name + '.json'

function VolumeError (volume) {
  this.message = volume
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
  VolumeError.prototype.toString = () => JSON.stringify(this)
}

function VolumeNotFoundError (volume) {
  this.message = volume
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
}

function LibraryError (library) {
  this.message = library
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
  LibraryError.prototype.toString = () => JSON.stringify(this)
}

function LibraryNotFoundError (volume) {
  this.message = volume
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
}

function volumeSearchMatches (volume, searchTerms) {
  return (volume.name && (volume.name.includes(searchTerms) || volume.name === c.SELF_VOLUME_NAME))
}

async function volumeExists (name) {
  const meta = await system.api.safeMetadata(volumeKey(name))
  return meta ? meta.name : false
}

async function findVolume (name) {
  if (name === c.SELF_VOLUME_NAME) {
    return system.volume
  }
  try {
    return JSON.parse((await system.api.readFile(volumeKey(name))).toString())
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      throw new VolumeNotFoundError(name)
    }
    throw e
  }
}

async function listVolumes (query) {
  return await _listVolumes(query)
}

async function listVolumesWithoutSelf (query) {
  query.includeSelf = false
  return await _listVolumes(query)
}

const listVolumeCache = new LRU({ max: 1000 })

async function _listVolumes (query) {
  const cacheKey = shasum(query ? JSON.stringify(query) : '~')
  let results = listVolumeCache.get(cacheKey)
  if (!results) {
    const objectList = await system.api.safeList(VOLUME_PREFIX)
    const allVolumes = []
    for (const object of objectList) {
      if (object.type === m.FILE_TYPE) {
        allVolumes.push(JSON.parse(await system.api.readFile(object.name)))
      }
    }
    if (query.includeSelf) {
      // push special volume: self (dest)
      allVolumes.push(system.volume)
    }
    results = q.search(allVolumes, query, volumeSearchMatches, vol.sortVolumesByField)
    listVolumeCache.set(cacheKey, results)
  }
  return results
}

async function connectVolume (volume) {
  // determine readOnly (default true) and options
  const readOnly = typeof volume.readOnly === 'boolean' ? volume.readOnly : true
  const cacheSize = volume.cacheSize || 0
  const opts = Object.assign({}, volume.opts || {}, { readOnly, cacheSize })

  // determine encryption
  const enc = volume.encryption && volume.encryption.key ? volume.encryption : null

  // test connection
  return await mobiletto(volume.type, volume.key, volume.secret, opts, enc)
}

async function createVolume (volume) {
  if (!volume || !volume.name) {
    throw new VolumeError(`createVolume: no name for volume: ${JSON.stringify(volume)}`)
  }
  if (await volumeExists(volume.name)) {
    throw new VolumeError(`createVolume: volume exists: ${volume.name}`)
  }

  // set mount type
  const readOnly = typeof volume.readOnly === 'boolean' ? volume.readOnly : true
  volume.mount = readOnly ? vol.VOLUME_MOUNT_SOURCE : vol.VOLUME_MOUNT_DESTINATION

  // test connection
  try {
    await connectVolume(volume)
  } catch (e) {
    if (e instanceof MobilettoError) {
      throw new VolumeError(`${e}`)
    } else {
      logger.error(`createVolume: connectVolume error: ${e}`)
      throw e
    }
  }

  // save volume
  const now = Date.now()
  const volumeRecord = Object.assign({}, volume, { ctime: now, mtime: now })
  try {
    const bytesWritten = await system.api.writeFile(volumeKey(volume.name), JSON.stringify(volumeRecord))
    if (bytesWritten > 0) {
      listVolumeCache.clear()
    }
  } catch (e) {
    logger.warn(`createVolume: error writing volume file: ${e}`)
    throw e
  }
}

async function deleteVolume (name) {
  if (name === c.SELF_VOLUME_NAME) {
    throw new VolumeError(`deleteVolume: cannot delete self: ${name}`)
  }
  if (!(await volumeExists(name))) {
    throw new VolumeNotFoundError(name)
  }
  try {
    const bytesWritten = await system.api.remove(volumeKey(name))
    if (bytesWritten > 0) {
      listVolumeCache.clear()
    }
  } catch (e) {
    logger.warn(`deleteVolume: error removing volume file: ${e}`)
    throw e
  }
}

const VOLUME_APIS = {}

async function connect (name) {
  if (!name) {
    throw new TypeError('no volume name')
  }
  if (VOLUME_APIS[name]) {
    return VOLUME_APIS[name]
  }
  const volume = await findVolume(name)
  VOLUME_APIS[name] = await connectVolume(volume)
  VOLUME_APIS[name].name = name
  return VOLUME_APIS[name]
}

const connectedVolumes = () => Object.keys(VOLUME_APIS)
const connectedSources = () => vol.filterSources(connectedVolumes())
const connectedDestinations = () => vol.filterDestinations(connectedVolumes())

async function extractVolumeAndPathAndConnect (from) {
  const { volumeName, pth } = vol.extractVolumeAndPath(from)
  const volume = await connect(volumeName)
  if (!volume) {
    throw new VolumeError(`extractVolumeAndPathAndConnect(${from}): error connecting to volume`)
  }
  volume.name = volumeName
  return { volume, pth: decodeURI(pth) }
}

const LIBRARY_PREFIX = 'libraries/'
const libraryKey = libraryId => libraryId.startsWith(LIBRARY_PREFIX) ? libraryId : VOLUME_PREFIX + libraryId + '.json'

const listLibraries = async (query) => {
  return await _listLibraries(query)
}

const listLibrariesCache = new LRU({ max: 1000 })

const librarySearchMatches = (library, searchTerms) =>
  (library.hash && (library.hash.includes(searchTerms))) ||
  (library.source && (library.source.includes(searchTerms))) ||
  (library.destination && (library.destination.includes(searchTerms) || library.destination === c.SELF_VOLUME_NAME))

async function libraryExists (name) {
  const meta = await system.api.safeMetadata(libraryKey(name))
  return meta ? meta.name : false
}

async function findLibrary (hash) {
  try {
    return JSON.parse((await system.api.readFile(libraryKey(hash))).toString())
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      throw new LibraryNotFoundError(hash)
    }
    throw e
  }
}

async function _listLibraries (query) {
  const cacheKey = shasum(query ? JSON.stringify(query) : '~')
  let results = listLibrariesCache.get(cacheKey)
  if (!results) {
    const objectList = await system.api.safeList(LIBRARY_PREFIX)
    const allLibraries = []
    for (const object of objectList) {
      if (object.type === m.FILE_TYPE) {
        allLibraries.push(JSON.parse(await system.api.readFile(object.name)))
      }
    }
    results = q.search(allLibraries, query, librarySearchMatches, vol.sortLibrariesByField)
    listLibrariesCache.set(cacheKey, results)
  }
  return results
}

async function createLibrary (library) {
  if (!library || !library.source || !library.destination) {
    throw new LibraryError(`createLibrary: no source or destination for library: ${JSON.stringify(library)}`)
  }
  library.hash = shasum( LIBRARY_PREFIX + '\n' + library.source + '\n' + library.destination)
  if (await libraryExists(library.hash)) {
    throw new LibraryError(`createLibrary: library exists: ${library.hash}`)
  }

  // save library
  const now = Date.now()
  const libraryRecord = Object.assign({}, library, { ctime: now, mtime: now })
  try {
    const bytesWritten = await system.api.writeFile(libraryKey(library.hash), JSON.stringify(libraryRecord))
    if (bytesWritten > 0) {
      listLibrariesCache.clear()
    }
  } catch (e) {
    logger.warn(`createLibrary: error writing library file: ${e}`)
    throw e
  }
}

async function deleteLibrary (hash) {
  if (!(await libraryExists(hash))) {
    throw new LibraryNotFoundError(hash)
  }
  try {
    const bytesWritten = await system.api.remove(libraryKey(hash))
    if (bytesWritten > 0) {
      listLibrariesCache.clear()
    }
  } catch (e) {
    logger.warn(`deleteLibrary: error removing library file: ${e}`)
    throw e
  }
}

export {
  connect,
  connectedVolumes, connectedSources, connectedDestinations,
  extractVolumeAndPathAndConnect,
  volumeExists, findVolume,
  listVolumes, listVolumesWithoutSelf,
  createVolume, deleteVolume,
  libraryExists, findLibrary,
  listLibraries, createLibrary, deleteLibrary,
  VolumeError, VolumeNotFoundError, LibraryError, LibraryNotFoundError
}
