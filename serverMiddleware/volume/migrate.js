const { MobilettoNotFoundError } = require('mobiletto-lite')

const c = require('../../shared')
const system = require('../util/config').SYSTEM
const vol = require('./volumeUtil')

async function connectVolumeOrSelf (name) {
  if (name === c.SELF_VOLUME_NAME) {
    return system.storage
  }
  return await vol.connect(name)
}

// path should NOT start with / but must end with
// but if path is empty, that's fine
function adjustPath (path) {
  if (!path || path === '') {
    return ''
  }
  let p = path
  if (p.startsWith('/')) {
    p = p.substring(1)
  }
  if (!p.endsWith('/')) {
    p += '/'
  }
  return p
}

async function migrateData (readStorage, readPath, writeStorage, writePath) {
  if (readStorage.name === writeStorage.name) {
    throw new TypeError('migrateData: readStorage.name and writeStorage.name are the same')
  }
  const readApi = await connectVolumeOrSelf(readStorage.name)
  const writeApi = await connectVolumeOrSelf(writeStorage.name)
  try {
    await writeApi.mirror(readApi, adjustPath(writePath), adjustPath(readPath))
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      throw new vol.VolumeNotFoundError(e.message)
    }
    throw new TypeError(`migrateData: error: ${e}`)
  }
  return true
}

module.exports = {
  migrateData
}
