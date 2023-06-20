const LRU = require('lru-cache')
const shasum = require('shasum')
const q = require('../../util/query')

const { MobilettoOrmError, MobilettoOrmValidationError, repositoryFactory } = require('mobiletto-orm')
const system = require('../../util/config').SYSTEM
const logger = system.logger
const {
  filterSources, filterDestinations,
  VOLUME_MOUNT_DESTINATION, VOLUME_TYPEDEF
} = require('../../../shared/type/volumeType')
const { mobiletto } = require('mobiletto-lite')

async function _connectVolume (volume) {
  // determine readOnly (default true) and options
  const readOnly = typeof volume.readOnly === 'boolean' ? volume.readOnly : true
  const cacheSize = volume.cacheSize || 0
  const opts = Object.assign({}, volume.opts || {}, { readOnly, cacheSize })

  // determine encryption
  const enc = volume.encryption && volume.encryption.key ? volume.encryption : null

  if (typeof(volume[volume.type]) !== 'object') {
    throw new MobilettoOrmError(`_connectVolume: expected volume[volume.type] to be an object. volume=${JSON.stringify(volume)}`)
  }
  if (typeof(volume[volume.type].key) !== 'string') {
    throw new MobilettoOrmError(`_connectVolume: expected volume[volume.type].key to be a string. volume=${JSON.stringify(volume)}`)
  }
  const key = volume[volume.type].key
  const secret = typeof(volume[volume.type].secret) === 'string'
    ? volume[volume.type].secret
    : null

  // test connection
  return await mobiletto(volume.type, key, secret, opts, enc)
}

const testVolumeConnection = _connectVolume

const VOLUME_APIS = {}

async function connectVolume (volume) {
  if (VOLUME_APIS[volume.name]) {
    return VOLUME_APIS[volume.name]
  }
  VOLUME_APIS[volume.name] = await _connectVolume(volume)
  VOLUME_APIS[volume.name].name = volume.name
  return VOLUME_APIS[volume.name]
}

const connectedVolumes = () => Object.keys(VOLUME_APIS)
const connectedSources = () => filterSources(connectedVolumes())
const connectedDestinations = () => filterDestinations(connectedVolumes())

const systemVolumeRepo = () => repositoryFactory([system.storage]).repository(VOLUME_TYPEDEF)

const mostRecentSyncedStorageArray = null

async function syncedStorage () {
  try {
    const noRedact = true
    const repo = systemVolumeRepo()
    const volumes = await repo.findAll({noRedact})
    const destinations = volumes
      .filter(dest => dest.mount === VOLUME_MOUNT_DESTINATION && dest.sync === true)
    const connects = []
    destinations.map(async dest => connects.push(connectVolume(dest)))
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

const REPO_FACTORY = repositoryFactory(syncedStorage)

const ORM_REPOSITORIES = {}

function ormRepo (typeDef) {
  if (!typeDef) {
    throw new MobilettoOrmError('ormRepo: typeDef is required')
  }
  if (typeof(typeDef.typeName) !== 'string' || typeDef.typeName.length === 0) {
    throw new MobilettoOrmError('ormRepo: typeDef.typeName is required')
  }
  if (!ORM_REPOSITORIES[typeDef.typeName]) {
    ORM_REPOSITORIES[typeDef.typeName] = REPO_FACTORY.repository(typeDef)
  }
  return ORM_REPOSITORIES[typeDef.typeName]
}

const DEFAULT_SORT = {
  name: (s1, s2) => s1.name && s2.name && s1.name < s2.name
}

class YBModel {
  constructor(typeDef) {
    this.typeDef = typeDef
    this.repository = ormRepo(typeDef)
    this.listCache = new LRU({ max: 1000 })
  }

  async create (thing) {
    if (await this.repository.exists(this.repository.id(thing))) {
      const errors = {}
      errors[this.repository.idField(thing)] = ['alreadyExists']
      throw new MobilettoOrmValidationError({ errors })
    }
    if (typeof(this.preCreate) === 'function') {
      thing = await this.preCreate(thing)
    }
    let created = this.repository.create(thing)
    if (typeof(this.postCreate) === 'function') {
      created = await this.postCreate(created)
    }
    this.listCache.clear()
    return created
  }

  async update (thing, found = null) {
    found = found ? found : await this.repository.findById(this.repository.id(thing))
    if (typeof(this.preUpdate) === 'function') {
      thing = await this.preUpdate(thing, found)
    }
    let updated = await this.repository.update(thing, found.version)
    if (typeof(this.postUpdate) === 'function') {
      updated = await this.postUpdate(updated)
    }
    this.listCache.clear()
    return updated
  }

  async delete (name) {
    if (typeof(this.preDelete) === 'function') {
      await this.preDelete(name)
    }
    const thing = await this.repository.findById(name)
    try {
      await this.repository.remove(name, thing.version)
    } catch (e) {
      logger.error(`delete(${this.repository.typeDef.typeName}): error writing tombstone: ${e}`)
      throw e
    }
    this.listCache.clear()
  }

  async findById (id, opts = null) {
    if (typeof(this.preDelete) === 'function') {
      const found = await this.preFindById(id)
      if (found) return found
    }
    return this.repository.findById(id, opts)
  }

  async exists (id) {
    try {
      return await this.repository.exists(id)
    } catch (e) {
      return false
    }
  }

  searchResultMatches (result, searchTerms) {
    if (typeof(this.searchMatcher) === 'function') {
      return this.searchMatcher(result, searchTerms)
    }
    return result.name && result.name.includes(searchTerms)
  }

  sortSearchResults (array, field, ascending) {
    if (this.sortByField) {
      return this.sortByField(array, field, ascending)
    } else {
      return ascending ? array.sort(DEFAULT_SORT[field]) : array.sort(DEFAULT_SORT[field]).reverse()
    }
  }

  async list (query) {
    return await this._list(query)
  }

  async _list (query) {
    const cacheKey = shasum(query ? JSON.stringify(query) : '~')
    let results = query.noCache ? null : this.listCache.get(cacheKey)
    if (!results) {
      const allVolumes = await this.repository.findAll({ removed: query.includeDeleted })
      if (query.includeSelf) {
        // push special volume: self (dest)
        allVolumes.push(system.volume)
      }
      results = q.search(allVolumes, query,
        (result, searchTerms) => this.searchResultMatches(result, searchTerms),
        (array, field, ascending) => this.sortSearchResults(array, field, ascending))
      this.listCache.set(cacheKey, results)
    }
    return results
  }

}

export {
  YBModel, testVolumeConnection, connectVolume
}
