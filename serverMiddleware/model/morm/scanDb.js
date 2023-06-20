const scanType = require('../../../shared/type/scanType')
const { YBModel } = require('./ybModel')

const scanDb = new YBModel(scanType.SCAN_TYPEDEF)

scanDb.scanInfo = async (name, forLibraries = []) => {
  try {
    return await this.repository.findById(name)
  } catch (e) {
    logger.warn(`scanInfo(${name}): error (returning NULL_SCAN): ${e}`)
    return scanType.nullScanResult(forLibraries)
  }
}

scanDb.recordScanStart = async (name, forLibraries = []) => {
  // let scanJson = await system.storage.safeReadFile(scanKey(name))
  // if (scanJson == null) {
  //   scanJson = {}
  // }
}

export { scanDb }
