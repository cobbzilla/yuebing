const { existsSync, mkdirSync } = require('fs')
const { basename } = require('path')
const winston = require('winston')
const vv = require('vee-validate')
const storage = require('mobiletto-lite')
const shasum = require('shasum')
const nuxt = require('../../nuxt.config').default
const c = require('../../shared')
const {
  isMediaInfoJsonProfile, mediaProfilesForSource
} = require('../../shared/media')
const { mediaInfoFields, mediaInfoField } = require('../../shared/mediainfo')

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: process.env.YB_LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf((info) => {
      return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`
    })),
  transports: process.env.YB_LOG_FILE
    ? [new winston.transports.File({ filename: process.env.YB_LOG_FILE })]
    : [new winston.transports.Console({ stderrLevels: Object.keys(winston.config.npm.levels) })]
})

const DEST_PREFIX = process.env.YB_DEST_PREFIX || ''

const SUPPORTED_DEST_TYPES = ['local', 's3', 'b2']

const DEST_TYPE = process.env.YB_DEST_TYPE
  ? process.env.YB_DEST_TYPE.toLowerCase()
  : process.env.YB_DEST_KEY && process.env.YB_DEST_BUCKET && process.env.YB_DEST_KEY.startsWith('AKIA')
    ? 's3'
    : process.env.YB_DEST_KEY && process.env.YB_DEST_BUCKET
      ? 'b2'
      : 'local'

const opts = DEST_TYPE === 's3'
  ? {
      type: 's3',
      region: process.env.YB_DEST_S3_REGION,
      bucket: process.env.YB_DEST_BUCKET,
      prefix: DEST_PREFIX
    }
  : DEST_TYPE === 'b2'
    ? {
      type: 'b2',
      bucket: process.env.YB_DEST_BUCKET,
      partSize: process.env.YB_DEST_B2_PART_SIZE || null, // null enables autodetect recommendedPartSize
      prefix: DEST_PREFIX
    }
    : DEST_TYPE === 'local' ? {
      type: 'local'
    } : null

const encryption = {
  key: process.env.YB_DATA_ENCRYPTION_KEY,
  iv: process.env.YB_DATA_ENCRYPTION_IV,
  algo: process.env.YB_DATA_ENCRYPTION_ALGO
}

const CONFIGS = ['public', 'private']

const USER_MEDIAINFO_JSON = 'userMediaInfo.json'

function defaultLocalStorageDir () {
  const path = '/tmp/yuebing-local-storage'
  if (!existsSync(path)) {
    mkdirSync(path)
  }
  return path
}

const key = process.env.YB_DEST_KEY || (opts && opts.type && opts.type === 'local' ? defaultLocalStorageDir() : null)
const secret = process.env.YB_DEST_SECRET

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
    const ext = c.getExtension(basename(pth)).toLowerCase()
    return 'source.' + ext
  },
  userMediaInfoPath: (sourceName, pth) => SYSTEM.assetsDir(sourceName + '/' + pth) + USER_MEDIAINFO_JSON,
  rawMediaInfo: async (meta, sourceName, pth) => {
    const profilesForSource = mediaProfilesForSource(pth)
    const mediaInfoProfile = Object.keys(meta.assets)
      .find(p => profilesForSource[p] && isMediaInfoJsonProfile(profilesForSource[p]))
    if (mediaInfoProfile && mediaInfoProfile.length > 0) {
      const mediaInfoPath = meta.assets[mediaInfoProfile][0]
      const mediaInfoJson = await SYSTEM.api.safeReadFile(mediaInfoPath)
      return mediaInfoJson ? JSON.parse(mediaInfoJson) : null
    }
  },
  userMediaInfo: async (meta, sourceName, pth) => {
    try {
      const mediaInfo = SYSTEM.rawMediaInfo(meta, sourceName, pth)
      const userMediaInfoJson = await SYSTEM.api.safeReadFile(SYSTEM.userMediaInfoPath(sourceName, pth))
      const userMediaInfo = userMediaInfoJson ? JSON.parse(userMediaInfoJson) : null
      if (mediaInfo !== null) {
        const result = {}
        if (mediaInfo || userMediaInfo) {
          for (const field of mediaInfoFields()) {
            result[field] = mediaInfoField(field, mediaInfo || {}, userMediaInfo || {})
          }
        }
        return result
      } else {
        return userMediaInfo || null
      }
    } catch (e) {
      logger.warn(`userMediaInfo(${sourceName}, ${pth}): ${e} (${JSON.stringify(e)})`)
      return null
    }
  },
  isPublic: () => SYSTEM.publicConfig.public,
  allowLocalAdmin: () => DEST_TYPE === 'local'
    && SYSTEM.privateConfig.admin?.user?.email === null
    && SYSTEM.privateConfig.admin?.user?.password === null,
  connect: async () => {
    if (!SYSTEM.api) {
      if (!SUPPORTED_DEST_TYPES.includes(DEST_TYPE)) {
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
        SYSTEM.api.find = async (dir, prefix) => {
          const pth = dir.endsWith('/') ? dir : dir + '/'
          try {
            const meta = await SYSTEM.api.safeMetadata(pth)
            if (meta && meta.mtime) {
              const listing = await SYSTEM.api.list(pth)
              return listing.filter(obj => basename(obj.name).startsWith(prefix))
            } else {
              logger.warn(`system.api.find(${dir}, ${prefix}) path not found, returning empty array`)
              return []
            }
          } catch (e) {
            logger.error(`system.api.find(${dir}, ${prefix}) error: ${e}`)
            throw e
          }
        }
      }
      // adjust redis if needed
      if (process.env.YB_REDIS_HOST) {
        logger.info(`using process.env.YB_REDIS_HOST=${process.env.YB_REDIS_HOST} as redis host`)
        SYSTEM.privateConfig.redis.host = process.env.YB_REDIS_HOST
      }
      if (process.env.YB_REDIS_PORT) {
        logger.info(`using process.env.YB_REDIS_PORT=${process.env.YB_REDIS_PORT} as redis port`)
        SYSTEM.privateConfig.redis.port = +process.env.YB_REDIS_PORT
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
  },
  lastModified: async (sourcePath) => {
    const lastModified = await SYSTEM.api.safeMetadata(SYSTEM.assetsDir(sourcePath) + c.LAST_MODIFIED_FILE)
    return lastModified && lastModified.mtime ? lastModified.mtime : null
  },
  deleteUserHandlers: {},
  deletePathHandlers: {},
  deletePath: async (path) => {
    for (const handlerName of Object.keys(SYSTEM.deletePathHandlers)) {
      try {
        logger.info(`deletePath(${path}) handler ${handlerName} starting`)
        await SYSTEM.deletePathHandlers[handlerName](path)
      } catch (e) {
        logger.error(`deletePath(${path}) handler ${handlerName} error: ${e}`)
      }
    }
  }
}

module.exports = { DEST_PREFIX, SYSTEM }
