const { basename, dirname } = require('path')
const { existsSync, writeFileSync } = require('fs')

const c = require('../../../shared')
const s = require('../../../shared/source')
const m = require('../../../shared/media')
const src = require('../../source/sourceUtil')
const VIDEO = require('../../../shared/media/video').default
const system = require('../../util/config').SYSTEM
const logger = system.logger

const DEFAULT_FIRST_THUMBNAIL_OFFSET = '3'

const VIDEO_ASSET_SUFFIX = m.assetSuffix(m.VIDEO_MEDIA_TYPE)

async function transcode (sourcePath, sourceFile, profile, outfile) {
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

async function dash (sourcePath, sourceFile, profile, outfile) {
  // adjust output file to match what xform.js checks for, for multiFile profiles
  const placeholder = outfile.indexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`dash: expected outfile to contain multifile placeholder (${c.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }
  const dashOutfile = outfile.substring(0, placeholder) +
    c.MULTIFILE_FIRST +
    outfile.substring(placeholder + c.MULTIFILE_PLACEHOLDER.length)
  logger.info(`dash: calculated dashOutfile = ${dashOutfile}`)

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

  // generate HLS playlist too
  if (profile.hlsProfile) {
    args.push('-hls_playlist')
    args.push('true')
    args.push('-hls_master_name')
    args.push(`${m.ASSET_PREFIX}${profile.hlsProfile}${VIDEO_ASSET_SUFFIX}master.m3u8`)
  }

  args.push('-f')
  args.push('dash')
  args.push('-y')
  args.push(dashOutfile)
  return args
}

async function thumbnails (sourcePath, sourceFile, profile, outfile) {
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

async function firstThumbnail (sourcePath, sourceFile, profile, outfile) {
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

function toLang (lang) {
  
}

// return value is an array of strings, which becomes the args to copyTextTracks_command below
async function copyTextTracks (sourcePath, sourceFile, profile, outfile) {

  const placeholder = outfile.indexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`copyTextTracks: expected outfile to contain multifile placeholder (${c.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }

  const TRACK_REGEX = new RegExp('(.+?)(\\.(\\w{2}(\\.(sdh))?))?\\.'+profile.ext+'$', 'ui')
  const { sourceName, pth } = s.extractSourceAndPath(sourcePath)
  const sourceDir = dirname(pth)
  const source = await src.connect(sourceName)

  const dirFiles = await source.safeList(sourceDir, {recursive: true})
  const filesCopied = []
  for (const f of dirFiles) {
    const filename = basename(f.name)
    const m = f.type && f.type === 'file' && f.name ? filename.match(TRACK_REGEX) : false
    if (m && m[0] === filename) {
      const sdh = typeof m[5] !== 'undefined' && m[5] === 'sdh' ? '.sdh' : ''
      const lang = typeof m[3] !== 'undefined' ? toLang(m[3]) : 'default'
      const destOutfile = outfile.substring(0, placeholder) + lang + sdh + "." + profile.ext
      const assetsFile = system.assetsDir(f.name) + basename(destOutfile)
      if (!existsSync(destOutfile) && (await system.api.safeMetadata(assetsFile)) === null) {
        logger.debug(`copyTextTracks: copying src=${f.name} -> destOutfile=${destOutfile}`)
        writeFileSync(destOutfile, await source.readFile(f.name))
        filesCopied.push({ source: f.name, dest: destOutfile })
      } else {
        logger.debug(`copyTextTracks: skipping src=${f.name} because destOutfile already exists: ${destOutfile}`)
      }
    }
  }
  return filesCopied
}

async function copyTextTracks_command (files) {
  logger.info(`copyTextTracks_command called with files=${JSON.stringify(files)}`)
  return 0
}

async function vttTextTracks (sourcePath, sourceFile, profile, outfile) {
  logger.info(`vttTextTracks called with sourcePath=${sourcePath}, sourceFile=${sourceFile}`)
}

async function vttTextTracks_command (files) {
  logger.info(`vttTextTracks_command called with files=${JSON.stringify(files)}`)
  for (const f of files) {
    // transform file to vtt, return
  }
  return 0
}

const normSize = (val) => {
  if (val.includes('x')) return val
  return VIDEO.ffmpeg_sizes[val]
}

const START_MPD_REPRESENTATION = '<Representation '
const END_MPD_REPRESENTATION = '</Representation>'

const filter_mpd = (buffer, profile, res) => {
  let output = ''
  // walk lines of mpd xml
  // if <Representation>:
  //  if mimeType="video/*" ... (codecs="avc1.4d4028" bandwidth="1024000" width="1920" height="1080" sar="1:1">)
  //    determine if profile matches bandwidth (subst k=>000, m=>000000), width and height
  //  if mimeType="audio/*" ... (codecs="mp4a.40.2" bandwidth="128000" audioSamplingRate="44100">)
  //    determine if profile matches bandwidth (subst k=>000, m=>000000) and audioSamplingRate==subProfile.audioRate
  // if no profile matches, or profile is not specific quality level, skip to next <Representation>
  // if profile is our quality level, keep the <Representation>
  let skipping = false
  let foundAnyVideo = false
  let foundAnyAudio = false
  for (const line of buffer.toString().split('\n')) {
    if (!skipping && line.trim().startsWith(START_MPD_REPRESENTATION)) {
      // wrangle XML attributes into JSON format, parse as object
      let repr
      try {
        repr = JSON.parse('{"' +
          line.trim().substring(START_MPD_REPRESENTATION.length, line.trim().lastIndexOf('>') - 1)
            .replaceAll('=', '":')
            .replaceAll(' ', ',\n"') +
          '"}')
      } catch (e) {
        logger.error(`filter_mpd: ${e}`)
        throw e
      }
      if (repr.mimeType && repr.mimeType.startsWith('video/')) {
        skipping = (!repr.bandwidth || m.bitrateInt(profile.videoBitrate) !== +repr.bandwidth || `${repr.width}x${repr.height}` !== normSize(profile.videoSize))
        foundAnyVideo ||= !skipping
      } else if (repr.mimeType && repr.mimeType.startsWith('audio/')) {
        skipping = (!repr.bandwidth || m.bitrateInt(profile.audioBitrate) !== +repr.bandwidth || +repr.audioSamplingRate !== +profile.audioRate)
        foundAnyAudio ||= !skipping
      }
    }
    if (skipping) {
      if (line.trim() === END_MPD_REPRESENTATION) {
        skipping = false
      }
    } else {
      output += line + '\n'
    }
  }
  if (!foundAnyVideo || !foundAnyAudio) {
    logger.error(`filter_mpd: missing representations for profile ${profile.name} with size=${profile.videoSize} (foundAnyVideo=${foundAnyVideo}, foundAnyAudio=${foundAnyAudio})`)
    return false
  }
  res.write(output + '\n')
  return true
}

const M3U8_STREAM_INFO = '#EXT-X-STREAM-INF:'
const M3U8_AUDIO_INFO = '#EXT-X-MEDIA:TYPE=AUDIO'
const filter_m3u8 = (buffer, profile, res) => {
  let skip = 0
  let output = ''
  let foundAny = false
  for (const line of buffer.toString().split('\n')) {
    if (skip > 0) {
      skip--
      continue
    }
    if (line.trim().startsWith(M3U8_AUDIO_INFO)) {
      if (!line.includes('DEFAULT=YES')) {
        continue
      }
    } else if (line.trim().startsWith(M3U8_STREAM_INFO)) {
      const info = {}
      line.substring(M3U8_STREAM_INFO.length)
        .split(',')
        .map(e => info[e.split('=')[0].toLowerCase()] = e.split('=')[1])
      if (!info.resolution || info.resolution !== normSize(profile.videoSize)) {
        skip = 2
        continue
      } else {
        foundAny = true
      }
    }
    output += line + '\n'
  }
  if (!foundAny) {
    logger.error(`filter_m3u8: no streams matched profile ${profile.name} with size=${profile.videoSize}`)
    return false
  }
  res.write(output)
  return true
}

const QUALITY_FILTERS = {
  mpd: filter_mpd,
  m3u8: filter_m3u8,
}

function isMasterPlaylist (path) {
  const name = basename(path)
  return name.endsWith('.mpd') || name.endsWith('master.m3u8')
}

async function quality (storage, path, profileName, res) {
  if (!profileName || profileName.length === 0) {
    return false
  }
  if (!isMasterPlaylist(path)) {
    return false
  }
  const qFilter = QUALITY_FILTERS[c.getExtension(path)]
  if (!qFilter) {
    return false
  }
  const profile = m.mediaProfileByName(m.VIDEO_MEDIA_TYPE, profileName)
  if (!profile) {
    return false
  }
  const chunks = []
  await storage.read(path, chunk => chunks.push(chunk))
  return qFilter(Buffer.concat(chunks), profile, res)
}

export {
  transcode, dash, thumbnails, firstThumbnail,
  copyTextTracks, copyTextTracks_command,
  vttTextTracks, vttTextTracks_command,
  quality
}
