const { glob } = require('glob')
const c = require('../../shared')
const util = require('../util/file')

const system = require('../util/config').SYSTEM
const logger = system.logger

function multifilePrefix (profile, outfile) {
  const placeholder = outfile.lastIndexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    return outfile
  }
  return outfile.substring(0, placeholder)
}

const cleanupTemporaryAssets = () => system.privateConfig.autoscan.cleanupTemporaryAssets

function deleteLocalFiles (outfile, profile, job, jobPrefix) {
  if (!cleanupTemporaryAssets()) {
    logger.warn(`deleteLocalFiles: deletion disabled, retaining outfile(s) ${outfile} for profile ${profile.name}`)
    return
  }
  if (profile.multiFile) {
    const outfilePrefix = multifilePrefix(profile, outfile)
    glob(outfilePrefix + '*', (err, files) => {
      if (err) {
        logger.error(`deleteLocalFiles: glob error: ${err}`)
        return
      }
      files.forEach(f => util.deleteFile(f))
      logger.info(`${jobPrefix}_deleted_local_files: ${files.join('\n')}`)
    })
  } else {
    util.deleteFile(outfile)
    logger.info(`${jobPrefix}_deleted_local_file: ${outfile}`)
  }
}

export { multifilePrefix, deleteLocalFiles }
