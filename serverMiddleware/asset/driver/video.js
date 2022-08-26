const c = require('../../../shared')
const m = require('../../../shared/media')

const DEFAULT_FIRST_THUMBNAIL_OFFSET = '3'

const VIDEO_ASSET_SUFFIX = m.assetSuffix(m.VIDEO_MEDIA_TYPE)

function transcode (sourcePath, sourceFile, profile, outfile) {
  const args = []
  args.push('-i')
  args.push(sourceFile)
  args.push('-vcodec')
  args.push(profile.videoCodec)
  args.push('-s')
  args.push(profile.videoSize)
  args.push('-r')
  args.push(profile.frameRate)
  args.push('-b:v')
  args.push(profile.videoBitrate)
  args.push('-acodec')
  args.push(profile.audioCodec)
  args.push('-ac')
  args.push(profile.audioChannels)
  args.push('-ar')
  args.push(profile.audioRate)
  args.push('-b:a')
  args.push(profile.audioBitrate)
  args.push('-y')
  args.push(outfile)
  return args
}

function dash (sourcePath, sourceFile, profile, outfile) {
  // adjust output file to match what xform.js checks for, for multiFile profiles
  const placeholder = outfile.indexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`dash: expected outfile to contain multifile placeholder (${c.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }
  const dashOutfile = outfile.substring(0, placeholder) +
    c.MULTIFILE_FIRST +
    outfile.substring(placeholder + c.MULTIFILE_PLACEHOLDER.length)
  console.log(`dash: calculated dashOutfile = ${dashOutfile}`)

  const args = []
  args.push('-i')
  args.push(sourceFile)
  for (let i = 0; i < profile.subProfiles.length; i++) {
    args.push('-map')
    args.push('0')
  }
  for (let i = 0; i < profile.subProfiles.length; i++) {
    args.push(`-c:a:${i}`)
    args.push(profile.subProfiles[i].audioCodec)
    args.push(`-b:a:${i}`)
    args.push(profile.subProfiles[i].audioBitrate)
    args.push(`-ar:${i}`)
    args.push(profile.subProfiles[i].audioRate)
    args.push(`-ac:${i}`)
    args.push(profile.subProfiles[i].audioChannels)
    args.push(`-c:v:${i}`)
    args.push(profile.subProfiles[i].videoCodec)
    args.push(`-b:v:${i}`)
    args.push(profile.subProfiles[i].videoBitrate)
    args.push(`-s:v:${i}`)
    args.push(profile.subProfiles[i].videoSize)
    args.push(`-profile:v:${i}`)
    args.push('main')
  }

  // we enable the template below, so I'm not sure if window_size is relevant
  // but given that the playlist will be statically hosted and never dynamically
  // generated we set this to a very large value, such that the playlist should
  // always contain all segments
  args.push('-window_size')
  args.push('1000000')

  // are these needed? they are the defaults
  args.push('-use_timeline')
  args.push('1')
  args.push('-use_template')
  args.push('1')

  // todo: see what these do: b-frames, minimum keyframe interval and GOP (group of picture) size
  // args.push('-bf')
  // args.push('1')
  // args.push('-keyint_min')
  // args.push('120')
  // args.push('-g')
  // args.push('120')
  // args.push('-sc_threshold')
  // args.push('0') // default is already zero?
  // args.push('-b_strategy')
  // args.push('0') // default is already zero?

  // todo: add a subtitles set if we detect that the media has subtitles
  args.push('-adaptation_sets')
  args.push('id=0,streams=v id=1,streams=a')

  // ensure output assets are named appropriately so that handleOutputFiles picks them up
  args.push('-init_seg_name')
  args.push(`${m.ASSET_PREFIX}${profile.name}${VIDEO_ASSET_SUFFIX}init-stream$RepresentationID$.$ext$`)
  args.push('-media_seg_name')
  args.push(`${m.ASSET_PREFIX}${profile.name}${VIDEO_ASSET_SUFFIX}chunk-stream$RepresentationID$-$Number%05d$.$ext$`)

  args.push('-f')
  args.push('dash')
  args.push('-y')
  args.push(dashOutfile)
  return args
}

function thumbnails (sourcePath, sourceFile, profile, outfile) {
  const args = []
  args.push('-i')
  args.push(sourceFile)
  args.push('-s')
  args.push(profile.size)
  args.push('-vf')
  args.push('fps=' + profile.fps)
  args.push('-y')
  args.push(outfile)
  return args
}

function firstThumbnail (sourcePath, sourceFile, profile, outfile) {
  const offset = profile.offset && profile.offset > 0 ? profile.offset : DEFAULT_FIRST_THUMBNAIL_OFFSET
  const args = []
  args.push('-ss')
  args.push('' + offset)
  args.push('-accurate_seek')
  args.push('-i')
  args.push(sourceFile)
  args.push('-s')
  args.push(profile.size)
  args.push('-frames:v')
  args.push('1')
  args.push('-y')
  args.push(outfile)
  return args
}

export { transcode, dash, thumbnails, firstThumbnail }
