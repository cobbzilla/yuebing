const { MobilettoNotFoundError } = require('mobiletto')

const c = require('../../shared')
const system = require('../util/config').SYSTEM
const s = require('./sourceUtil')

async function connectSourceOrSelf (name) {
  if (name === c.SELF_SOURCE_NAME) {
    return system.api
  }
  return await s.connect(name)
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
    throw new TypeError('migrateData: readSource and writeSource are the same')
  }
  const readApi = await connectSourceOrSelf(readStorage.name)
  const writeApi = await connectSourceOrSelf(writeStorage.name)
  try {
    await writeApi.mirror(readApi, adjustPath(writePath), adjustPath(readPath))
  } catch (e) {
    if (e instanceof MobilettoNotFoundError) {
      throw new s.SourceNotFoundError(e.message)
    }
    throw new TypeError(`migrateData: error: ${e}`)
  }
  return true
}

module.exports = {
  migrateData
}
