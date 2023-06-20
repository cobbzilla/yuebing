const { MobilettoOrmTypeDef } = require('mobiletto-orm-typedef')
const { AUTOSCAN_MINIMUM_INTERVAL } = require('../../shared/type/scanType')

const LIBRARY_TYPEDEF = new MobilettoOrmTypeDef({
  typeName: 'library',
  fields: {
    sources: { type: 'array' },
    destinations: { type: 'array' },
    autoscan: {
      fields: {
        enabled: { type: 'boolean' },
        interval: {
          control: 'duration',
          minValue: AUTOSCAN_MINIMUM_INTERVAL
        }
      }
    }
  }
})

const LIBRARY_SORT = {
  source: (s1, s2) => s1.source && s2.source && s1.source < s2.source,
  destination: (s1, s2) => s1.destination && s2.destination && s1.destination < s2.destination
}

function sortLibrariesByField (array, field, ascending) {
  return ascending ? array.sort(LIBRARY_SORT[field]) : array.sort(LIBRARY_SORT[field]).reverse()
}

export {
  LIBRARY_TYPEDEF, sortLibrariesByField
}
