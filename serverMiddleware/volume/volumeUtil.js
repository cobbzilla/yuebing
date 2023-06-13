import { repositoryFactory, MobilettoOrmError, MobilettoOrmNotFoundError } from 'mobiletto-orm'

const LRU = require('lru-cache')
const shasum = require('shasum')
const { mobiletto } = require('mobiletto-lite')
const { AUTOSCAN_MINIMUM_INTERVAL } = require('./scan')
const c = require('../../shared')
const m = require('../../shared/media')
const vol = require('../../shared/volume')
const q = require('../util/query')
const system = require('../util/config').SYSTEM
const logger = system.logger

const VOLUME_TYPEDEF = {
  typeName: 'volume',
  fields: {
    name: {
      required: true
    },
    type: {
      required: true
    },
    key: {
      required: true
    },
    mount: {},
    secret: {},
    readOnly: {},
    cacheSize: { minValue: 0, default: 100 },
    encryption: {}
  }
}

const SYNC_TYPEDEF = {
  typeName: 'sync',
  fields: {
    sync: { required: true, default: true }
  }
}

const SCAN_TYPEDEF = {
  typeName: 'scan',
  fields: {}
}

const LIBRARY_TYPEDEF = {
  typeName: 'library',
  fields: {
    sources: {},
    destinations: {},
    autoscan: {}
  }
}

const mostRecentSyncedStorageArray = null

async function syncedStorage () {
  try {
    const repo = systemVolumeRepo()
    const volumes = await repo.findAll()
    const destinations = volumes
      .filter(dest => dest.mount === vol.VOLUME_MOUNT_DESTINATION)
    const syncRepo = systemSyncRepo()
    const syncDestinations = destinations
      .filter(async dest => {
        try {
          return (await syncRepo.findById(dest.name)).sync === true
        } catch (e) {
          logger.warn(`syncedStorage: error checking sync for dest=${dest.name}: ${e}`)
        }
        return false
      })

    const connects = []
    syncDestinations.map(async dest => connects.push(_connectVolume(dest)))
    const destConns = await Promise.all(connects)
    return [system.storage, ...destConns]

  } catch (e) {
    if (mostRecentSyncedStorageArray && mostRecentSyncedStorageArray.length > 0) {
      logger.warn(`syncedStorage error (returning mostRecentSyncedStorageArray): ${e}`)
      return mostRecentSyncedStorageArray
    } else {
      logger.error(`syncedStorage error (returning system.storage only): ${e}`)
      return [system.storage]
    }
  }
}

const systemVolumeRepo = () => repositoryFactory([system.storage]).repository(VOLUME_TYPEDEF)
const systemSyncRepo = () => repositoryFactory([system.storage]).repository(SYNC_TYPEDEF)
const REPO_FACTORY = repositoryFactory(syncedStorage)

const ORM_REPOSITORIES = {}

function ormRepo (typeDef) {
  if (typeof(typeDef.typeName) !== 'string' || typeDef.typeName.length === 0) {
    throw new MobilettoOrmError('ormRepo: typeDef.typeName is required')
  }
  if (!ORM_REPOSITORIES[typeDef.typeName]) {
    ORM_REPOSITORIES[typeDef.typeName] = REPO_FACTORY.repository(typeDef)
  }
  return ORM_REPOSITORIES[typeDef.typeName]
}

const volumeRepository = ormRepo(VOLUME_TYPEDEF)
const syncRepository = ormRepo(SYNC_TYPEDEF)
const scanRepository = ormRepo(SCAN_TYPEDEF)
const libraryRepository = ormRepo(LIBRARY_TYPEDEF)

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
    return await volumeRepository.findById(name, { removed: findDeleted })
  } catch (e) {
    if (e instanceof MobilettoOrmNotFoundError) {
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
  let results = query.noCache ? null : listVolumeCache.get(cacheKey)
  if (!results) {
    const syncPromises = []
    const allVolumes = await volumeRepository.findAll({ removed: query.includeDeleted })
    allVolumes.forEach(v => syncPromises.push(new Promise(async (resolve, reject) => {
      try {
        v.sync = await isSync(v.name)
        resolve(v.sync)
      } catch (e) {
        reject(e)
      }
    })))
    await Promise.all(syncPromises)
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
  try {
    const created = await volumeRepository.create(volume)
    if (created) {
      listVolumeCache.clear()
    }
  } catch (e) {
    logger.error(`createVolume: error: ${e}`)
    throw e
  }
}

const NULL_SCAN = { scanning: false, lastScanStart: 0, lastScanEnd: 0 }
const nullScanResult = (forLibraries) => Object.assign({}, { libraries: forLibraries }, NULL_SCAN)

async function scanInfo (name, forLibraries = []) {
  try {
    return await scanRepository.findById(name)
  } catch (e) {
    logger.warn(`scanInfo(${name}): error (returning NULL_SCAN): ${e}`)
    return nullScanResult(forLibraries)
  }
}

async function recordScanStart (name, forLibraries = []) {
  // let scanJson = await system.storage.safeReadFile(scanKey(name))
  // if (scanJson == null) {
  //   scanJson = {}
  // }
}

async function isSync (name) {
  if (c.isSelfVolume(name)) {
    return true
  }
  try {
    const found = await syncRepository.findById(name)
    return found.sync === true
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
  let found
  try {
    found = await syncRepository.findById(name)
    if (deleteSync) {
      syncRepository.remove(name, found.version)
    } else {
      syncRepository.update({ id: name, sync }, found.version)
    }
  } catch (e) {
    if (e instanceof MobilettoOrmNotFoundError) {
      await syncRepository.create({ id: name, sync })
    } else {
      throw e
    }
  }
  return Object.assign({}, volume, { sync })
}

async function deleteVolume (name) {
  if (c.isSelfVolume(name)) {
    throw new VolumeError(`deleteVolume: cannot delete self: ${name}`)
  }
  const volume = await findVolume(name)
  try {
    await volumeRepository.remove(name, volume.version)
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

async function _connectVolume (volume) {
  if (VOLUME_APIS[volume.name]) {
    return VOLUME_APIS[volume.name]
  }
  VOLUME_APIS[volume.name] = await connectVolume(volume)
  VOLUME_APIS[volume.name].name = volume.name
  return VOLUME_APIS[volume.name]
}

async function connect (name) {
  if (!name) {
    throw new TypeError('no volume name')
  }
  if (VOLUME_APIS[name]) {
    return VOLUME_APIS[name]
  }
  const volume = await findVolume(name)
  return _connectVolume(volume)
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
    return await libraryRepository.findById(name, { removed: findDeleted })
  } catch (e) {
    if (e instanceof MobilettoOrmNotFoundError) {
      throw new LibraryNotFoundError(name)
    }
    throw e
  }
}

async function _listLibraries (query) {
  const cacheKey = shasum(query ? JSON.stringify(query) : '~')
  let results = listLibrariesCache.get(cacheKey)
  if (!results) {
    const objectList = await libraryRepository.findAll({ removed: query.includeDeleted })
    const allLibraries = []
    for (const object of objectList) {
      if (object.type === m.FILE_TYPE) {
        try {
          const library = object.object
          allLibraries.push(library)
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
  try {
    let saved
    if (forCreate) {
      saved = await libraryRepository.create(library)
    } else {
      const found = await libraryRepository.findById(library.name)
      saved = await libraryRepository.update(library, found.version)
    }
    listLibrariesCache.clear()
    return saved
  } catch (e) {
    logger.warn(`saveLibrary: error saving library ${library.id}: ${e}`)
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
    const found = await libraryRepository.findById(name)
    libraryRepository.remove(name, found.version)
    listLibrariesCache.clear()
  } catch (e) {
    logger.warn(`deleteLibrary: error removing library: ${e}`)
    throw e
  }
}

export {
  connect,
  connectedVolumes, connectedSources, connectedDestinations,
  extractVolumeAndPathAndConnect,
  volumeExists, findVolume,
  listVolumes, listVolumesWithoutSelf,
  createVolume, scanInfo, setSync, deleteVolume,
  libraryExists, findLibrary,
  listLibraries, createLibrary, updateLibrary, deleteLibrary,
  VolumeError, VolumeNotFoundError,
  LibraryError, LibraryNotFoundError, LibraryValidationError,
  ormRepo
}
