const { deriveMediaInfo, deriveMetadata } = require('../manifest')

const shasum = require('shasum')
const { basename, dirname } = require('path')
const { existsSync, writeFileSync } = require('fs')
const { ALL_LANGS } = require('hokeylization/util/constants')
const ISO_639 = require('hokeylization/util/iso639')

const c = require('../../../shared')
const s = require('../../../shared/volume')
const m = require('../../../shared/media')
const src = require('../../volume/volumeUtil')
const VIDEO = require('../../../shared/media/video').default
const { srt2webvtt } = require('../../../shared/media/video_srt2vtt')
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
    // map audio tracks
    args.push('-map')
    args.push('0:a')
    args.push(`-c:a:${i}`)
    args.push(profile.subProfiles[i].audioCodec)
    args.push(`-b:a:${i}`)
    args.push(profile.subProfiles[i].audioBitrate)
    args.push(`-ar:${i}`)
    args.push(profile.subProfiles[i].audioRate)
    args.push(`-ac:${i}`)
    args.push(profile.subProfiles[i].audioChannels)

    // skip subtitle tracks, they're handled separately
    // The "negative mapping" is described here: https://trac.ffmpeg.org/wiki/Map
    args.push('-map')
    args.push('-0:s?')

    // map video tracks
    args.push('-map')
    args.push('0:v')
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

  // use DASH format
  args.push('-f')
  args.push('dash')

  // overwrite output file
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

const LANG_MAP = {}

const ALL_LANGS_ARRAY = ALL_LANGS.split(',')

function getLangMap () {
  if (c.okl(LANG_MAP) > 0) {
    return LANG_MAP
  }
  try {
    for (const langCode of ALL_LANGS_ARRAY) {
      const lang = langCode.toLowerCase()
      LANG_MAP[lang] = lang
      const langSpecificLangs = require('hokeylization/messages/locales_' + lang)
      for (const locVar in langSpecificLangs) {
        if (locVar.startsWith('locale_')) {
          const loc = locVar.substring('locale_'.length).toLowerCase()
          const langValue = langSpecificLangs[locVar]
          LANG_MAP[langValue] = loc
          LANG_MAP[langValue.toLocaleLowerCase(loc)] = loc
          LANG_MAP[langValue.toLowerCase()] = loc
        }
      }
    }
    for (const langCode of Object.keys(ISO_639)) {
      LANG_MAP[langCode] = ISO_639[langCode]
    }
  } catch (e) {
    logger.error(`getLangMap: error: ${JSON.stringify(e)}`)
    throw e
  }
  return LANG_MAP
}

function toLang (lang) {
  const langMap = getLangMap()
  if (langMap.hasOwnProperty(lang)) {
    return langMap[lang]
  }
  const lcLang = lang.toLowerCase()
  if (langMap.hasOwnProperty(lcLang)) {
    return langMap[lcLang]
  }
  logger.warn(`toLang(${lang}): unrecognized, returning as-is`)
  return lang
}

// return value is an array of strings, which becomes the args to copyTextTracks_command below
// noinspection JSUnusedGlobalSymbols
async function copyTextTracks (sourcePath, sourceFile, profile, outfile) {
  const placeholder = outfile.indexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`copyTextTracks: expected outfile to contain multifile placeholder (${c.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }

  const TRACK_REGEX = new RegExp('(.+?)(\\.(\\w{2}(\\.(sdh))?))?\\.'+profile.ext+'$', 'ui')
  const { volume, pth } = s.extractVolumeAndPath(sourcePath)
  const sourceDir = dirname(pth)
  const source = await src.connect(volume)

  const dirFiles = await source.safeList(sourceDir, {recursive: true})
  const filesCopied = []
  for (let i=0; i<dirFiles.length; i++) {
    const f = dirFiles[i]
    const filename = basename(f.name)
    const m = f.type && f.type === 'file' && f.name ? filename.match(TRACK_REGEX) : false
    if (m && m[0] === filename) {
      const sdh = typeof m[5] !== 'undefined' && m[5] === 'sdh' ? '.sdh' : ''
      const lang = typeof m[3] !== 'undefined' ? toLang(m[3]) : 'default'
      const index = String(i).padStart(3, '0')
      const destOutfile = outfile.substring(0, placeholder) + index + '.' + lang + sdh + '.' + profile.ext
      const destOutfileBase = basename(destOutfile)
      // sanity check
      if (!destOutfileBase.match(VIDEO.textTrackRegex)) {
        logger.error(`copyTextTracks: invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${VIDEO.textTrackRegex}`)
        continue
      }
      const assetsFile = system.assetsDir(f.name) + destOutfileBase
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

// noinspection JSUnusedGlobalSymbols
async function copyTextTracks_command (files) {
  logger.info(`copyTextTracks_command called with files=${JSON.stringify(files)}`)
  return 0
}

// noinspection JSUnusedGlobalSymbols
async function srt2vttTracks (sourcePath, sourceFile, profile, outfile) {
  const placeholder = outfile.indexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`srt2vttTracks: expected outfile to contain multifile placeholder (${c.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }
  if (profile.ext !== 'vtt') {
    throw new TypeError(`srt2vttTracks: expected profile.ext === 'vtt' but was '${profile.ext}'`)
  }
  const SRT_TRACK_REGEX = new RegExp('(.+?)(\\.(\\w{2}(\\.(sdh))?))?\\.srt$', 'ui')
  const { volume, pth } = s.extractVolumeAndPath(sourcePath)
  const sourceDir = dirname(pth)
  const source = await src.connect(volume)

  const dirFiles = await source.safeList(sourceDir, {recursive: true})
  const srtFilesConverted = []
  for (let i=0; i<dirFiles.length; i++) {
    const f = dirFiles[i]
    const filename = basename(f.name)
    const srtMatch = f.type && f.type === 'file' && f.name ? filename.match(SRT_TRACK_REGEX) : false
    if (srtMatch && srtMatch[0] === filename) {
      const sdh = typeof srtMatch[5] !== 'undefined' && srtMatch[5] === 'sdh' ? '.sdh' : ''
      const lang = typeof srtMatch[3] !== 'undefined' ? toLang(srtMatch[3]) : 'default'
      const vttHash = shasum(profile.name + i + ' ' + lang + sdh) + '.'
      const destOutfile = outfile.substring(0, placeholder) + vttHash + lang + sdh + '.vtt'
      const destOutfileBase = basename(destOutfile)
      // sanity check
      if (!destOutfileBase.match(VIDEO.textTrackRegex)) {
        logger.error(`srt2vttTracks: invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${VIDEO.textTrackRegex}`)
        continue
      }
      const assetsFile = system.assetsDir(f.name) + destOutfileBase
      if (!existsSync(destOutfile) && (await system.api.safeMetadata(assetsFile)) === null) {
        logger.debug(`srt2vttTracks: translating src=${f.name} -> destOutfile=${destOutfile}`)
        try {
          const srtData = await source.readFile(f.name)
          const vttData = srt2webvtt(srtData)
          writeFileSync(destOutfile, vttData)
          srtFilesConverted.push({ source: f.name, dest: destOutfile })
        } catch (e) {
          logger.error(`srt2vttTracks: error: ${JSON.stringify(e)}`)
        }
      } else {
        logger.debug(`srt2vttTracks: skipping src=${f.name} because destOutfile already exists: ${destOutfile}`)
      }
    }
  }
  return srtFilesConverted
}

// noinspection JSUnusedGlobalSymbols
async function srt2vttTracks_command (files) {
  logger.info(`srt2vttTracks_command called with files=${JSON.stringify(files)}`)
  return 0
}

function codecForTextTrackContentType (contentType) {
  const ct = contentType.toLowerCase()
  if (ct === 'text/vtt') return 'webvtt'
  if (ct === 'application/x-subrip') return 'subrip'
  // todo: support other text track types?
  return null
}

async function extractTextTracks (sourcePath, sourceFile, profile, outfile) {
  const logPrefix = `extractTextTracks(sourcePath=${sourcePath}, profile=${profile.name}):`
  const codec = codecForTextTrackContentType(profile.contentType)
  if (codec == null) {
    logger.warn(`${logPrefix} skipping (unsupported text track contentType: ${profile.contentType})`)
    return null
  }

  const { source, pth } = await src.extractVolumeAndPathAndConnect(sourcePath)
  const meta = await deriveMetadata(source, pth)
  const textTracks = []
  if (!meta) {
    logger.warn(`${logPrefix} skipping (deriveMetadata returned null)`)
    return null
  }

  const mediainfo = await system.rawMediaInfo(meta, source, pth)
  if (!(mediainfo && 'media' in mediainfo && 'track' in mediainfo.media)) {
    logger.warn(`${logPrefix} skipping (no tracks found)`)
    return null
  }
  for (const track of mediainfo.media.track) {
    if (!('@type' in track && track['@type'] === 'Text')) {
      logger.silly(`${logPrefix} skipping non-text track: ${JSON.stringify(track)}`)
      continue
    }
    if (!('Format' in track)) {
      logger.warn(`${logPrefix} skipping text track (no Format): ${JSON.stringify(track)}`)
      continue
    }
    if (!('Language' in track && ALL_LANGS_ARRAY.includes(track.Language))) {
      logger.warn(`${logPrefix} skipping unsupported text track (expected valid Language): ${JSON.stringify(track)}`)
      continue
    }
    textTracks.push(track)
  }

  if (textTracks.length === 0) {
    logger.info(`${logPrefix} no supported text tracks found, skipping`)
    return null
  }

  const placeholder = outfile.indexOf(c.MULTIFILE_PLACEHOLDER)
  if (placeholder === -1) {
    throw new TypeError(`${logPrefix} expected outfile to contain multifile placeholder (${c.MULTIFILE_PLACEHOLDER}): ${outfile}`)
  }
  const outfilePrefix = outfile.substring(0, placeholder)

  const args = []
  args.push('-i')
  args.push(sourceFile)
  for (let i=0; i<textTracks.length; i++) {
    const track = textTracks[i]
    args.push('-c')
    args.push(codec)
    args.push('-map')
    args.push(`0:s:${i}`)
    const index = String(i).padStart(3, '0')
    const langOutputFile = `${outfilePrefix}${index}.${track.Language}.${profile.ext}`
    const destOutfileBase = basename(langOutputFile)
    // sanity check
    if (!destOutfileBase.match(VIDEO.textTrackRegex)) {
      logger.error(`${logPrefix} invalid destOutfileBase (${destOutfileBase}) did not match textTrackRegex=${VIDEO.textTrackRegex}`)
      continue
    }
    args.push(langOutputFile)
  }
  args.push("-y")
  return args
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
  srt2vttTracks, srt2vttTracks_command,
  extractTextTracks, quality
}
