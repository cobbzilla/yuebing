const c = require('../../../shared')
const vol = require('../../../shared/type/volumeType')
const { YBModel, testVolumeConnection, connectVolume } = require('./ybModel')
const system = require('../../util/config').SYSTEM
const logger = system.logger

const volumeDb = new YBModel(vol.VOLUME_TYPEDEF)

volumeDb.preCreate = async (volume) => {
  // test connection
  try {
    await testVolumeConnection(volume)

    // set readOnly based on mount type, only destinations are read/write
    const isDestination = volume.mount === vol.VOLUME_MOUNT_DESTINATION
    volume.readOnly = !isDestination

    return volume
  } catch (e) {
    throw new VolumeError(`${e}`)
  }
}

volumeDb.preDelete = async (name) => {
  if (c.isSelfVolume(name)) {
    throw new VolumeError(`deleteVolume: cannot delete self: ${name}`)
  }
}

volumeDb.preFindById = async (name) => {
  if (c.isSelfVolume(name)) {
    return system.volume
  }
  return null
}

volumeDb.searchMatcher = (result, searchTerms) => {
  return (result.name && (result.name.includes(searchTerms) || c.isSelfVolume(result)))
}

volumeDb.sortByField = vol.sortVolumesByField

function VolumeError (message) {
  this.message = message
  if ('captureStackTrace' in Error) {
    Error.captureStackTrace(this, TypeError)
  } else {
    this.stack = (new Error(this.message)).stack
  }
  VolumeError.prototype.toString = () => JSON.stringify(this)
}

volumeDb.connect = async (name) => {
  if (!name) {
    throw new TypeError('no volume name')
  }
  const volume = await volumeDb.findById(name)
  return connectVolume(volume)
}

async function extractVolumeAndPathAndConnect (from) {
  const { volume, pth } = vol.extractVolumeAndPath(from)
  const volumeObj = await volumeDb.connect(volume)
  if (!volumeObj) {
    throw new VolumeError(`extractVolumeAndPathAndConnect(${from}): error connecting to volume`)
  }
  volumeObj.name = volume
  return { volume: volumeObj, pth: decodeURI(pth) }
}

export {
  volumeDb, extractVolumeAndPathAndConnect, VolumeError
}
