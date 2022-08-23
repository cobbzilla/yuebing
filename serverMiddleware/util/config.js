const vv = require('vee-validate')
const storage = require('mobiletto')
const shasum = require('shasum')
const nuxt = require('../../nuxt.config').default
const c = require('../../shared')

const key = process.env.YB_DEST_KEY
const secret = process.env.YB_DEST_SECRET

const DEST_PREFIX = process.env.YB_DEST_PREFIX || ''

const opts = {
  region: process.env.YB_DEST_REGION,
  bucket: process.env.YB_DEST_BUCKET,
  prefix: DEST_PREFIX
}

const encryption = {
  key: process.env.YB_DATA_ENCRYPTION_KEY,
  iv: process.env.YB_DATA_ENCRYPTION_IV,
  algo: process.env.YB_DATA_ENCRYPTION_ALGO
}

const CONFIGS = ['public', 'private']

async function updateConfigAtLevel (topLevel, updateTarget, configTarget, configPath, errors) {
  const configurable = updateTarget.configurable
  if (configurable) {
    for (const field of Object.keys(configurable)) {
      if (updateTarget[field] === configTarget[field]) {
        continue
      }
      const fieldConfig = configurable[field]
      const fieldPath = configPath + '_' + field
      if (fieldConfig.rules) {
        const valid = await vv.validate(configTarget[field], fieldConfig.rules)
        if (valid.valid) {
          // allow the field to be set
          updateTarget[field] = configTarget[field]
        } else {
          if (typeof errors[fieldPath] === 'undefined') {
            errors[fieldPath] = []
          }
          errors[fieldPath].push(...Object.keys(valid.failedRules))
        }
      } else if (configTarget[field] && typeof updateTarget[field] === 'object') {
        await updateConfigAtLevel(topLevel, updateTarget[field], configTarget[field], fieldPath, errors)
      }
    }
  }
  return errors
}

const SYSTEM = {
  api: null,
  publicConfig: {},
  privateConfig: {},
  canonicalDestBase: null,

  connect: async () => {
    if (!SYSTEM.api) {
      const enc = !encryption.key ? null : encryption
      SYSTEM.api = await storage.connect('s3', key, secret, opts, enc)
      for (const config of CONFIGS) {
        // read config, merge into nuxt config, write back to storage
        const configFile = `${config}Config.json`
        let storedConfig
        try {
          storedConfig = JSON.parse(await SYSTEM.api.readFile(configFile))
        } catch (e) {
          console.log(`config: error reading stored config (${configFile}): ${JSON.stringify(e)}`)
          storedConfig = {}
        }
        const merged = SYSTEM[`${config}Config`] = Object.assign({}, nuxt[`${config}RuntimeConfig`], storedConfig)
        SYSTEM.api.writeFile(configFile, JSON.stringify(merged))
      }
    }
    return SYSTEM
  },
  updateConfig: async (newConfig) => {
    const errors = {}
    const updatedConfig = {}
    for (const topLevel of Object.keys(newConfig)) {
      if (!SYSTEM[topLevel]) {
        errors.push({ configCategory: ['invalid'] })
        continue
      }
      updatedConfig[topLevel] = JSON.parse(JSON.stringify(SYSTEM[topLevel]))
      await updateConfigAtLevel(topLevel, updatedConfig[topLevel], newConfig[topLevel], topLevel, errors)
    }
    if (Object.keys(errors).length === 0) {
      for (const topLevel of Object.keys(newConfig)) {
        if (JSON.stringify(SYSTEM[topLevel]) === JSON.stringify(updatedConfig[topLevel])) {
          console.log(`updateConfig(${topLevel}): not changed, not writing to storage`)
        } else {
          await SYSTEM.api.writeFile(`${topLevel}.json`, JSON.stringify(updatedConfig[topLevel]))
          SYSTEM[topLevel] = updatedConfig[topLevel]
          console.log(`updateConfig(${topLevel}): SAVED NEW CONFIG`)
        }
      }
    }
    return errors
  },
  canonicalDestDir (path) {
    const rawPrefix = SYSTEM.canonicalDestBase
    const slug = c.scrub(path)
    const sha = shasum(path)
    const prefix = rawPrefix.endsWith('/') ? rawPrefix : rawPrefix + '/'
    const canonical = prefix + sha.substring(0, 2) +
      '/' + sha.substring(2, 4) +
      '/' + sha.substring(4, 6) +
      '/' + slug +
      '/'
    // console.log('canonicalDestDir(' + path + ') returning ' + canonical)
    return canonical
  },
  recordError: async (sourcePath, profile, error) => {
    const path = SYSTEM.canonicalDestDir(sourcePath) + c.ERROR_FILE_PREFIX + profile + '_' + Date.now()
    await SYSTEM.api.writeFile(path, `${error}`)
    console.log(`recordError: recorded: ${path} = ${error}`)
  },
  clearErrors: async (path, profile) => {
    const prefix = SYSTEM.canonicalDestDir(path) + c.ERROR_FILE_PREFIX + profile
    console.log(`clearErrors(${path}, ${profile}): looking for files with prefix: ${prefix}`)
    const files = await SYSTEM.api.list(prefix)
    if (files && files.length ? files.length : 0) {
      files.forEach((file) => {
        console.log(`clearErrors(${path}, ${profile}): deleting: ${file.name}`)
        SYSTEM.api.remove(file.name)
      })
    }
  },
  countErrors: async (sourcePath, profile) => {
    const files = await SYSTEM.api.list(SYSTEM.canonicalDestDir(sourcePath) + c.ERROR_FILE_PREFIX + profile)
    const count = files && files.length ? files.length : 0
    console.log(`countErrors(${sourcePath}, ${profile}) returning: ${count}`)
    return count
  },
  touchLastModified: async (sourcePath) => {
    const path = SYSTEM.canonicalDestDir(sourcePath) + c.LAST_MODIFIED_FILE
    await SYSTEM.api.writeFile(path, '' + Date.now())
    console.log(`touchLastModified: touched: ${path}`)
  }
}

module.exports = { DEST_PREFIX, SYSTEM }