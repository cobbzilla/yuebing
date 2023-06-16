const api = require('../../util/api')
const c = require('../../../shared')
const u = require('../../user/userUtil')
const s = require('../../volume/volumeUtil')
const v = require('../../../shared/model/validation')
const migrate = require('../../volume/migrate')

async function validate (migration) {
  const errors = {}

  const readSource = migration.readSource
  let readStorage = null
  if (!readSource) {
    errors.readSource = ['required']
  } else {
    try {
      readStorage = await s.findVolume(readSource)
    } catch (e) {
      if (e instanceof s.VolumeNotFoundError) {
        errors.readSource = ['notFound']
      }
    }
  }
  const writeSource = migration.writeSource
  let writeStorage = null
  if (!writeSource) {
    errors.writeSource = ['required']
  } else {
    try {
      writeStorage = await s.findVolume(writeSource)
      if (writeStorage.readOnly) {
        errors.writeSource = ['readOnly']
      }
    } catch (e) {
      if (e instanceof s.VolumeNotFoundError) {
        errors.writeSource = ['notFound']
      }
    }
  }
  if (readSource === writeSource) {
    if (c.empty(errors.writeSource)) { errors.writeSource = [] }
    errors.writeSource.push('cannotMirrorToSame')
  }
  const hasErrors = !c.empty(errors)
  if ((!readStorage || !writeStorage) && hasErrors) {
    // we should have both read and write storage to return, and no errors
    errors.readSource = ['notFound']
  } else if (hasErrors) {
    // we have other errors, return those
    return { readStorage, writeStorage, errors }
  } else {
    // run regular validator, return any errors
    const validationErrors = await v.validate(migration)
    return { readStorage, writeStorage, errors: validationErrors }
  }
}

// noinspection JSUnusedGlobalSymbols
export default {
  path: '/api/admin/migrate',
  async handler (req, res) {
    const user = await u.requireAdmin(req, res)
    if (!user) {
      return
    }
    if (req.method !== 'POST') {
      return api.forbidden(res)
    }
    req.on('data', async (data) => {
      res.contentType = 'application/json'
      const migration = JSON.parse(data)

      const { readStorage, writeStorage, errors } = await validate(migration)
      if (!c.empty(errors)) {
        return api.handleValidationError(res, errors)
      }
      migrate.migrateData(readStorage, migration.readPath, writeStorage, migration.writePath).then((results) => {
        return api.okJson(res, results)
      },
      (err) => {
        return err instanceof s.VolumeNotFoundError
          ? api.notFound(err.message)
          : api.serverError(res, `migrateUsers ERROR: ${err}`)
      })
    })
  }
}
