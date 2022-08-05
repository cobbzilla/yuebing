const fs = require('fs')
const path = require('path')
const Queue = require('bull')
const s3cfg = require('../s3/s3client.js')
const s3util = require('../s3/s3util')
const util = require('../util/file')
const c = require('../../media')
const manifest = require('./manifest')

const MAX_XFORM_ERRORS = 3

async function createArtifacts (sourcePath, localSourceFile) {
  console.log('createArtifacts starting with file: ' + localSourceFile)

  const mediaType = c.mediaType(sourcePath)
  const profiles = c.mediaProfilesForSource(sourcePath)
  if (profiles === null) {
    console.log(`no media profiles exist for path: ${sourcePath} (returning basic meta)`)
    return
  }

  for (const name in profiles) {
    const profile = profiles[name]
    let completedAssetKey
    let outfile

    // determine which destKey we will check to determine if the transform has completed
    if (profile.multiFile) {
      const outfilePrefix = path.dirname(localSourceFile) + '/' + c.ASSET_PREFIX + name + '_'
      outfile = outfilePrefix + util.MULTIFILE_PLACEHOLDER + '.' + profile.ext
      completedAssetKey = util.canonicalDestDir(sourcePath) + c.ASSET_PREFIX + name + '_' + util.MULTIFILE_FIRST + '.' + profile.ext
    } else {
      outfile = path.dirname(localSourceFile) + '/' + c.ASSET_PREFIX + name + '.' + profile.ext
      completedAssetKey = util.canonicalDestDir(sourcePath) + path.basename(outfile)
    }

    const destHead = await s3util.headDestObject(completedAssetKey)
    if (destHead && destHead.ContentLength && destHead.ContentLength > 0) {
      console.log(`createArtifacts: artifact ${path.basename(completedAssetKey)} exists for profile ${name} (skipping) for source ${sourcePath}`)
      continue
    }
    const errCount = await s3util.countErrors(sourcePath, name)
    if (errCount >= MAX_XFORM_ERRORS) {
      console.warn(`createArtifacts: transcoding artifact for profile ${name} has failed too many times (${errCount} >= ${MAX_XFORM_ERRORS}) for ${sourcePath}, giving up`)
      continue
    }

    const mediaLib = require('./' + mediaType)
    mediaLib.transform(sourcePath, localSourceFile, profile, outfile)
  }
}

async function ensureSourceDownloaded (sourcePath) {
  // Does the local copy of the source exist already?
  const file = util.workbenchDir + util.canonicalWorkingDir(sourcePath) + util.canonicalSourceFile(sourcePath)
  const size = util.statSize(file)

  const sourceBucketParams = Object.assign({}, s3cfg.sourceBucketParams, { Key: sourcePath })
  let downloadSource = true
  if (size !== -1) {
    // we have a file with some size. do a HEAD request for the source
    // we might already have the whole file
    const head = await s3util.headSourceObject(sourcePath)
    if (head && head.ContentLength && head.ContentLength === size) {
      downloadSource = false
    }
  }

  if (downloadSource) {
    console.log('downloading source to file: ' + file)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    await s3util.downloadObjectToFile(s3cfg.sourceClient, sourceBucketParams, file)
    const downloadSize = util.statSize(file)
    const head = await s3util.headSourceObject(sourcePath)
    if (head && head.ContentLength && head.ContentLength === downloadSize) {
      console.log('successfully downloaded complete source file: ' + file)
    } else {
      console.error('downloaded file ' + file + ' (size=' + downloadSize + ') which does not match source size: ' + head.ContentLength)
      util.deleteFile(file)
      return null
    }
  }
  return file
}

const jobQueue = new Queue('xform', 'redis://127.0.0.1:6379')
const JOB_QUEUE_NAME = 'xform-jobs'

jobQueue.process(JOB_QUEUE_NAME, util.MAX_CONCURRENT_TRANSFORMS, (job, done) => {
  console.log('jobQueue.process starting with job: ' + JSON.stringify(job))
  const sourcePath = job.data.sourcePath
  ensureSourceDownloaded(sourcePath).then((file) => {
    if (file) {
      createArtifacts(sourcePath, file).then(() => done())
    }
  })
})

async function transform (sourcePath) {
  if (!c.hasProfiles(sourcePath)) {
    console.log(`'transform(${sourcePath}): no profiles exist, not transforming`)
    return
  }

  console.log(`'transform(${sourcePath}) fetching metadata`)
  const derivedMeta = await manifest.deriveMetadata(sourcePath)
  if (derivedMeta && derivedMeta.status && derivedMeta.status.complete) {
    return derivedMeta
  }
  console.log('added to jobQueue: ' + sourcePath)
  jobQueue.add(JOB_QUEUE_NAME, { sourcePath })
  return derivedMeta
}

export { transform }
