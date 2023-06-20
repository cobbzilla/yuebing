const { MobilettoOrmTypeDef } = require('mobiletto-orm-typedef')

const AUTOSCAN_MINIMUM_INTERVAL = 1000 * 60 * 60
const AUTOSCAN_MINIMUM_INITIAL_DELAY = 1000 * 5

const SCAN_TYPEDEF = new MobilettoOrmTypeDef({
  typeName: 'scan',
  fields: {}
})

const NULL_SCAN = { scanning: false, lastScanStart: 0, lastScanEnd: 0 }
const nullScanResult = (forLibraries) => Object.assign({}, { libraries: forLibraries }, NULL_SCAN)

export {
  SCAN_TYPEDEF, nullScanResult, AUTOSCAN_MINIMUM_INTERVAL, AUTOSCAN_MINIMUM_INITIAL_DELAY
}
