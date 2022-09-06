const path = require('path')
const winston = require('winston')
const vv = require('vee-validate')
const storage = require('mobiletto')
const shasum = require('shasum')
const nuxt = require('../../nuxt.config').default
const c = require('../../shared')
const {
  isMediaInfoJsonProfile, mediaProfilesForSource
} = require('../../shared/media')
const { mediaInfoFields, mediaInfoField } = require('../../shared/mediainfo')

const logger = winston.createLogger({
  level: process.env.YB_LOG_LEVEL || 'debug',
  format: winston.format.simple(),
  transports: process.env.YB_LOG_FILE
    ? [new winston.transports.File({ filename: process.env.YB_LOG_FILE })]
    : [new winston.transports.Console()]
})

const key = process.env.YB_DEST_KEY
const secret = process.env.YB_DEST_SECRET

const DEST_PREFIX = process.env.YB_DEST_PREFIX || ''

const SUPPORTED_DEST_TYPES = ['s3', 'b2']

const DEST_TYPE = process.env.YB_DEST_TYPE ? process.env.YB_DEST_TYPE.toLowerCase() : null

const opts = DEST_TYPE === 's3'
  ? {
      type: 's3',
      region: process.env.YB_DEST_S3_REGION,
      bucket: process.env.YB_DEST_BUCKET,
      prefix: DEST_PREFIX
    }
  : {
      type: 'b2',
      bucket: process.env.YB_DEST_BUCKET,
      partSize: process.env.YB_DEST_B2_PART_SIZE || null, // null enables autodetect recommendedPartSize
      prefix: DEST_PREFIX
    }

const encryption = {
  key: process.env.YB_DATA_ENCRYPTION_KEY,
  iv: process.env.YB_DATA_ENCRYPTION_IV,
  algo: process.env.YB_DATA_ENCRYPTION_ALGO
}

const CONFIGS = ['public', 'private']

const USER_MEDIAINFO_JSON = 'userMediaInfo.json'

function isMatch (obj, prefix, matches) {
  if (path.basename(obj.name).startsWith(prefix)) {
    matches.push(obj)
  }
  return true
}

const SYSTEM = {
  logger,
  api: null,
  source: { name: c.SELF_SOURCE_NAME },
  publicConfig: {},
  privateConfig: {},
  workbenchDir: process.env.YB_WORK_DIR
    ? process.env.YB_WORK_DIR.endsWith('/')
      ? process.env.YB_WORK_DIR
      : process.env.YB_WORK_DIR + '/'
    : '/tmp/yuebing_workdir/',
  workingDir: path => SYSTEM.workbenchDir + shasum(path) + '/',
  canonicalSourceFile (pth) {
    const ext = c.getExtension(path.basename(pth)).toLowerCase()
    return 'source.' + ext
  },
  userMediaInfoPath: (sourceName, pth) => SYSTEM.assetsDir(sourceName + '/' + pth) + USER_MEDIAINFO_JSON,
  userMediaInfo: async (meta, sourceName, pth) => {
    try {
      const profilesForSource = mediaProfilesForSource(pth)
      const mediaInfoProfile = Object.keys(meta.assets)
        .find(p => profilesForSource[p] && isMediaInfoJsonProfile(profilesForSource[p]))
      if (mediaInfoProfile && mediaInfoProfile.length > 0) {
        const mediaInfoPath = meta.assets[mediaInfoProfile][0]
        const mediaInfoJson = await SYSTEM.api.safeReadFile(mediaInfoPath)
        const mediaInfo = mediaInfoJson ? JSON.parse(mediaInfoJson) : null
        const userMediaInfoJson = await SYSTEM.api.safeReadFile(SYSTEM.userMediaInfoPath(sourceName, pth))
        const userMediaInfo = userMediaInfoJson ? JSON.parse(userMediaInfoJson) : null
        const result = {}
        if (mediaInfo || userMediaInfo) {
          for (const field of mediaInfoFields()) {
            result[field] = mediaInfoField(field, mediaInfo || {}, userMediaInfo || {})
          }
        }
        return result
      } else {
        const userMediaInfo = await SYSTEM.api.safeReadFile(SYSTEM.userMediaInfoPath(sourceName, pth))
        return userMediaInfo || null
      }
    } catch (e) {
      logger.warn(`userMediaInfo(${sourceName}, ${pth}): ${e} (${JSON.stringify(e)})`)
      return null
    }
  },
  connect: async () => {
    if (!SYSTEM.api) {
      if (!DEST_TYPE) {
        throw new TypeError('config: required env var YB_DEST_TYPE was undefined')
      } else if (!SUPPORTED_DEST_TYPES.includes(DEST_TYPE)) {
        throw new TypeError(`config: YB_DEST_TYPE (${process.env.YB_DEST_TYPE}) is not a supported type. Should be one of: ${SUPPORTED_DEST_TYPES.toString()}`)
      }

      const enc = !encryption.key ? null : encryption
      SYSTEM.api = await storage.connect(DEST_TYPE, key, secret, opts, enc)
      for (const config of CONFIGS) {
        // read config, merge into nuxt config, write back to storage
        const configFile = `${config}Config.json`
        let storedConfig
        try {
          storedConfig = JSON.parse(await SYSTEM.api.readFile(configFile))
        } catch (e) {
          logger.info(`config: error reading stored config (${configFile}): ${JSON.stringify(e)}`)
          storedConfig = {}
        }
        const merged = SYSTEM[`${config}Config`] = Object.assign({}, nuxt[`${config}RuntimeConfig`], storedConfig)
        SYSTEM.api.writeFile(configFile, JSON.stringify(merged))
        SYSTEM.api.find =
          async (dir, prefix) => {
            const pth = dir.endsWith('/') ? dir : dir + '/'
            const matches = []
            // noinspection ES6RedundantAwait
            const visitor = async obj => await Promise.resolve(isMatch(obj, prefix, matches))
            await SYSTEM.api.safeList(pth, { visitor })
            return matches
          }
      }
    }
    logger.info(`connect: SYSTEM connected, workDir=${SYSTEM.workbenchDir}`)
    return SYSTEM
  },
  configUpdateHandlers: {},
  registerConfigUpdateHandler (fieldPath, handler) {
    SYSTEM.configUpdateHandlers[fieldPath] = handler
  },
  updateConfigAtLevel: async (topLevel, updateTarget, configTarget, configPath, errors, handlers) => {
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
            const updateHandler = SYSTEM.configUpdateHandlers[fieldPath]
            if (updateHandler) {
              handlers.add(updateHandler)
            }
          } else {
            if (typeof errors[fieldPath] === 'undefined') {
              errors[fieldPath] = []
            }
            errors[fieldPath].push(...Object.keys(valid.failedRules))
          }
        } else if (updateTarget[field] === null) {
          updateTarget[field] = configTarget[field]
        } else if (configTarget[field] && typeof updateTarget[field] === 'object') {
          await SYSTEM.updateConfigAtLevel(topLevel, updateTarget[field], configTarget[field], fieldPath, errors, handlers)
        }
      }
    } else {
      for (const field of Object.keys(updateTarget)) {
        if (typeof configTarget[field] === 'object' &&
          configTarget[field] !== null &&
          updateTarget[field] !== null &&
          typeof updateTarget[field] === 'object') {
          const fieldPath = configPath + '_' + field
          await SYSTEM.updateConfigAtLevel(topLevel, updateTarget[field], configTarget[field], fieldPath, errors, handlers)
        }
      }
    }
    return errors
  },
  updateConfig: async (newConfig) => {
    const errors = {}
    const updatedConfig = {}
    const updateHandlers = new Set()
    const update = SYSTEM.updateConfigAtLevel
    for (const topLevel of Object.keys(newConfig)) {
      if (!SYSTEM[topLevel]) {
        errors.push({ configCategory: ['invalid'] })
        continue
      }
      updatedConfig[topLevel] = JSON.parse(JSON.stringify(SYSTEM[topLevel]))
      await update(topLevel, updatedConfig[topLevel], newConfig[topLevel], topLevel, errors, updateHandlers)
    }
    if (c.empty(errors)) {
      for (const topLevel of Object.keys(newConfig)) {
        if (JSON.stringify(SYSTEM[topLevel]) === JSON.stringify(updatedConfig[topLevel])) {
          logger.info(`updateConfig(${topLevel}): not changed, not writing to storage`)
        } else {
          await SYSTEM.api.writeFile(`${topLevel}.json`, JSON.stringify(updatedConfig[topLevel]))
          SYSTEM[topLevel] = updatedConfig[topLevel]
          for (const handler of updateHandlers) {
            handler()
          }
          logger.info(`updateConfig(${topLevel}): SAVED NEW CONFIG`)
        }
      }
    }
    return errors
  },
  assetsPrefix: 'assets/',
  assetsDir (path) {
    const sha = shasum(path)
    return this.assetsPrefix +
      sha.substring(0, 2) +
      '/' + sha.substring(2, 4) +
      '/' + sha.substring(4, 6) +
      '/' + sha +
      '/'
  },
  recordError: async (sourcePath, profile, error) => {
    const path = SYSTEM.assetsDir(sourcePath) + c.ERROR_FILE_PREFIX + profile + '_' + Date.now()
    await SYSTEM.api.writeFile(path, `${error}`)
    logger.info(`recordError: recorded: ${path} = ${error}`)
  },
  clearErrors: async (path, profile) => {
    const prefix = SYSTEM.assetsDir(path)
    logger.info(`clearErrors(${path}, ${profile}): looking for files with prefix: ${prefix}`)
    const files = await SYSTEM.api.find(prefix, c.ERROR_FILE_PREFIX + profile)
    if (files && files.length ? files.length : 0) {
      files.forEach((file) => {
        logger.info(`clearErrors(${path}, ${profile}): deleting: ${file.name}`)
        SYSTEM.api.remove(file.name)
      })
    }
  },
  countErrors: async (sourcePath, profile) => {
    const prefix = SYSTEM.assetsDir(sourcePath)
    const files = await SYSTEM.api.find(prefix, c.ERROR_FILE_PREFIX + profile)
    const count = files && files.length ? files.length : 0
    logger.info(`countErrors(${sourcePath}, ${profile}) returning: ${count}`)
    return count
  },
  touchLastModified: async (sourcePath) => {
    const path = SYSTEM.assetsDir(sourcePath) + c.LAST_MODIFIED_FILE
    await SYSTEM.api.writeFile(path, '' + Date.now())
    logger.info(`touchLastModified: touched: ${path}`)
  }
}

module.exports = { DEST_PREFIX, SYSTEM }
