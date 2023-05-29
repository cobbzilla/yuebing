const LRU = require('lru-cache')
const shasum = require('shasum')
const { dirname, basename } = require('fs')
const {
  mobiletto, MobilettoError, MobilettoNotFoundError
} = require('mobiletto-lite')
const { AUTOSCAN_MINIMUM_INTERVAL } = require('./scan')
const c = require('../../shared')
const m = require('../../shared/media')
const vol = require('../../shared/volume')
const q = require('../util/query')
const system = require('../util/config').SYSTEM
const logger = system.logger

const VOLUME_PREFIX = 'volumes/'
const SYNC_PREFIX = 'sync/'

const volumeKey = name => name.startsWith(VOLUME_PREFIX)
    ? dirname(name) + basename(name) + '.json'
    : VOLUME_PREFIX + name + '.json'

const syncKey = name => name.startsWith(SYNC_PREFIX)
    ? dirname(name) + basename(name) + '.json'
    : SYNC_PREFIX + name + '.json'

function VolumeError (message) {
  this.message = message
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

function LibraryValidationError (errors) {
  this.message = JSON.stringify(errors)
  this.errors = errors
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
  LibraryValidationError.prototype.toString = () => JSON.stringify(this)
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
  return (volume.name && (volume.name.includes(searchTerms) || c.isSelfVolume(volume)))
}

async function volumeExists (name) {
  try {
    return await findVolume(name) != null
  } catch (e) {
    return false
  }
}

async function findVolume (name, findDeleted = false) {
  if (c.isSelfVolume(name)) {
    return system.volume
  }
  try {
    const volume = JSON.parse((await system.storage.readFile(volumeKey(name))).toString())
    return volume.deleted ? findDeleted ? volume : null : volume
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
    const objectList = await system.storage.safeList(VOLUME_PREFIX)
    const allVolumes = []
    for (const object of objectList) {
      if (object.type === m.FILE_TYPE) {
        try {
          const volume = JSON.parse(await system.storage.readFile(object.name))
          if (volume.deleted && !query.includeDeleted) {
            continue
          } else if (!volume.deleted) {
            volume.sync = await isSync(volume.name)
          }
          allVolumes.push(volume)
        } catch (e) {
          logger.warn(`_listVolumes: error reading volume ${object.name}: ${JSON.stringify(e)}`)
        }
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

  // set readOnly based on mount type, only destinations are read/write
  const isDestination = volume.mount === vol.VOLUME_MOUNT_DESTINATION
  volume.readOnly = !isDestination

  // test connection
  try {
    await connectVolume(volume)
  } catch (e) {
    throw new VolumeError(`${e}`)
  }

  // save volume
  const now = Date.now()
  const volumeRecord = Object.assign({}, volume, { ctime: now, mtime: now })
  try {
    const bytesWritten = await system.storage.writeFile(volumeKey(volume.name), JSON.stringify(volumeRecord))
    if (bytesWritten > 0) {
      listVolumeCache.clear()
    }
  } catch (e) {
    logger.warn(`createVolume: error writing volume file: ${e}`)
    throw e
  }
}

async function isSync (name) {
  if (c.isSelfVolume(name)) {
    return true
  }
  try {
    const syncJson = await system.storage.safeReadFile(syncKey(name))
    if (syncJson == null) return false
    const syncObj = JSON.parse(syncJson)
    return !syncObj.deleted && syncObj.sync === true
  } catch (e) {
    logger.warn(`isSync(${name}): error (returning false): ${e}`)
    return false
  }
}

async function setSync (name, sync, deleteSync  = false) {
  if (c.isSelfVolume(name)) {
    throw new VolumeError(`setSync: cannot setSync on self: ${name}`)
  }
  const volume = await findVolume(name)
  const syncFile = syncKey(name)
  if (!deleteSync || system.storage.safeReadFile(syncFile)) {
    const syncObj = deleteSync
      ? { name, deleted: Date.now() }
      : { name, sync, ctime: Date.now() }
    const syncJson = JSON.stringify(syncObj)
    const bytesWritten = await system.storage.writeFile(syncFile, syncJson)
    if (bytesWritten !== syncJson.length) {
      throw new VolumeError(`setSync(${name}, ${sync}): expected to write ${syncJson.length} bytes to ${syncFile} but wrote ${bytesWritten}`)
    }
  }
  return Object.assign({}, volume, { sync })
}

async function deleteVolume (name) {
  if (c.isSelfVolume(name)) {
    throw new VolumeError(`deleteVolume: cannot delete self: ${name}`)
  }
  const volume = await findVolume(name)
  const tombstone = { name: volume.name, deleted: Date.now() }
  try {
    const bytesWritten = await system.storage.writeFile(volumeKey(name), JSON.stringify(tombstone))
    if (bytesWritten > 0) {
      listVolumeCache.clear()
    }
  } catch (e) {
    logger.warn(`deleteVolume: error writing volume tombstone: ${e}`)
    throw e
  }
  try {
    await setSync(name, null, true)
  } catch (e) {
    logger.warn(`deleteVolume: error writing sync tombstone: ${e}`)
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
  const { volume, pth } = vol.extractVolumeAndPath(from)
  const volumeObj = await connect(volume)
  if (!volumeObj) {
    throw new VolumeError(`extractVolumeAndPathAndConnect(${from}): error connecting to volume`)
  }
  volumeObj.name = volume
  return { volume: volumeObj, pth: decodeURI(pth) }
}

const LIBRARY_PREFIX = 'libraries/'
const libraryKey = name => name.startsWith(LIBRARY_PREFIX) ? name : LIBRARY_PREFIX + name + '.json'

const listLibraries = async (query) => {
  return await _listLibraries(query)
}

const listLibrariesCache = new LRU({ max: 1000 })

const librarySearchMatches = (library, searchTerms) =>
  (library.hash && (library.hash.includes(searchTerms))) ||
  (library.source && (library.source.includes(searchTerms))) ||
  (library.destination && (library.destination.includes(searchTerms) || c.isSelfVolume(library.destination)))

async function libraryExists (name) {
  try {
    const library = await findLibrary(name)
    return library != null
  } catch (e) {
    return false
  }
}

async function findLibrary (name, findDeleted = false) {
  try {
    const library = JSON.parse((await system.storage.readFile(libraryKey(name))).toString())
    return library.deleted ? findDeleted ? library : null : library
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      throw new LibraryNotFoundError(name)
    }
    throw e
  }
}

async function _listLibraries (query) {
  const cacheKey = shasum(query ? JSON.stringify(query) : '~')
  let results = listLibrariesCache.get(cacheKey)
  if (!results) {
    const objectList = await system.storage.safeList(LIBRARY_PREFIX)
    const allLibraries = []
    for (const object of objectList) {
      if (object.type === m.FILE_TYPE) {
        try {
          const library = JSON.parse(await system.storage.readFile(object.name))
          if (!library.deleted || query.includeDeleted) {
            allLibraries.push(library)
          }
        } catch (e) {
          logger.warn(`_listLibraries: error reading volume ${object.name}: ${JSON.stringify(e)}`)
        }
      }
    }
    results = q.search(allLibraries, query, librarySearchMatches, vol.sortLibrariesByField)
    listLibrariesCache.set(cacheKey, results)
  }
  return results
}

const validateLibrary = async (library, forCreate = true) => {
  if (!library || typeof(library.name) !== 'string' || library.name.length === 0) {
    throw new LibraryValidationError({ 'name': [ 'required' ] })
  }
  if (forCreate && await libraryExists(library.name)) {
    throw new LibraryValidationError({ 'name': [ 'alreadyExists' ] })
  }
  if (c.empty(library.sources)) {
    throw new LibraryValidationError({ 'sources': [ 'required' ] })
  }
  if (c.empty(library.destinations)) {
    throw new LibraryValidationError({ 'destinations': [ 'required' ] })
  }
  if (library.autoscan) {
    library.autoscan.enabled = typeof(library.autoscan.enabled) === 'boolean' ? library.autoscan.enabled : false
    if (typeof(library.autoscan.interval) !== 'number') {
      throw new LibraryValidationError({ 'autoscan.interval': [ 'invalid' ] })
    }
    if (library.autoscan.interval < AUTOSCAN_MINIMUM_INTERVAL) {
      logger.warn(`For library ${library}, autoscan.interval was too small (${library.autoscan.interval}), setting to minimum of ${AUTOSCAN_MINIMUM_INTERVAL}`)
      library.autoscan.interval = AUTOSCAN_MINIMUM_INTERVAL
    }
  }
  for (const src of library.sources) {
    const volume = await findVolume(src)
    if (volume.mount !== vol.VOLUME_MOUNT_SOURCE) {
      throw new LibraryValidationError({ 'sources': [ 'invalid' ] })
    }
  }
  for (const dest of library.destinations) {
    if (c.isSelfVolume(dest)) continue
    const volume = await findVolume(dest)
    if (volume.mount !== vol.VOLUME_MOUNT_DESTINATION) {
      throw new LibraryValidationError({ 'destinations': [ 'invalid' ] })
    }
  }
  return library
}

const saveLibrary = async (library, forCreate) => {
  const now = Date.now()
  if (forCreate) {
    library.ctime = now
  }
  library.mtime = now
  const libFile = libraryKey(library.name)
  try {
    const bytesWritten = await system.storage.writeFile(libFile, JSON.stringify(library))
    if (bytesWritten > 0) {
      listLibrariesCache.clear()
    }
  } catch (e) {
    logger.warn(`saveLibrary: error writing library file (${libFile}): ${e}`)
    throw e
  }
}

async function createLibrary (lib) {
  const library = await validateLibrary(lib, true)
  return saveLibrary(library, true)
}

async function updateLibrary (lib) {
  const library = await validateLibrary(lib, false)
  return saveLibrary(library, false)
}

async function deleteLibrary (name) {
  if (!await libraryExists(name)) {
    return
  }
  try {
    const tombstone = { name, deleted: Date.now() }
    const bytesWritten = await system.storage.writeFile(libraryKey(name), JSON.stringify(tombstone))
    if (bytesWritten > 0) {
      listLibrariesCache.clear()
    }
  } catch (e) {
    logger.warn(`deleteLibrary: error writing library tombstone: ${e}`)
    throw e
  }
}

export {
  connect,
  connectedVolumes, connectedSources, connectedDestinations,
  extractVolumeAndPathAndConnect,
  volumeExists, findVolume,
  listVolumes, listVolumesWithoutSelf,
  createVolume, setSync, deleteVolume,
  libraryExists, findLibrary,
  listLibraries, createLibrary, updateLibrary, deleteLibrary,
  VolumeError, VolumeNotFoundError,
  LibraryError, LibraryNotFoundError, LibraryValidationError
}
