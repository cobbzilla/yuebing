const { LIBRARY_TYPEDEF, sortLibrariesByField } = require('../../../shared/type/libraryType')
const { YBModel } = require('./ybModel')
const { volumeDb } = require('./volumeDb')
const c = require('../../../shared')
const vol = require('../../../shared/type/volumeType')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const libraryDb = new YBModel(LIBRARY_TYPEDEF)

libraryDb.searchMatcher = (library, searchTerms) =>
  (library.hash && (library.hash.includes(searchTerms))) ||
  (library.source && (library.source.includes(searchTerms))) ||
  (library.destination && (library.destination.includes(searchTerms) || c.isSelfVolume(library.destination)))

libraryDb.sortByField = sortLibrariesByField

libraryDb.typeDef.validations.valid_sources = {
  field: 'sources',
  error: 'invalid',
  valid: async library => {
    for (const src of library.sources) {
      const volume = await volumeDb.findById(src)
      if (volume.mount !== vol.VOLUME_MOUNT_SOURCE) {
        return false
      }
    }
    return true
  }
}

libraryDb.typeDef.validations.valid_destinations = {
  field: 'destinations',
  error: 'invalid',
  valid: async library => {
    for (const dest of library.destinations) {
      const volume = await volumeDb.findById(dest)
      if (volume.mount !== vol.VOLUME_MOUNT_DESTINATION) {
        return false
      }
    }
    return true
  }
}

export { libraryDb }
