export default {

  name: 'video',
  from: 'standard', // inherit mediainfo operation and profiles

  // Source assets with these extensions will be filtered onto the destination
  ext: ['mp4', 'm4v', 'avi', 'mpg', 'mpeg', 'mov', 'webm', 'mkv', 'flv', '3gp', 'mpd', 'm4s', 'ts', 'm3u8'],

  // Configuration params for the supported operations
  // Currently the video transformer only uses these to verify that
  // the assets created have some minimum size to be considered valid
  // It's a very rudimentary check. Better validation of final assets would be great
  operations: {
    transcode: {
      minFileSize: 1024 * 128 // 128k min valid size
    },
    dash: {
      minFileSize: 128 // some m4s files can be small
    },
    thumbnails: {
      minFileSize: 64 // 64 bytes min valid size
    },
    firstThumbnail: {
      minFileSize: 64 // 64 bytes min valid size
    },
    copyTextTracks: {
      func: true,    // don't execute an external command, instead call the 'copyTextTracks_command' function
      minFileSize: 0 // no minimum size, there may be no subtitle files
    },
    srt2vttTracks: {
      func: true,    // don't execute an external command, instead call the 'srt2vttTracks_command' function
      minFileSize: 0 // no minimum size, there may be no subtitle files
    }
  },

  // Each profile can produce one asset, or many assets.
  // The existence of at least one 'primary' asset is required for
  // an object to be considered 'ready' for viewing in the webapp.
  // The 'operation' field determines what the media-specific transformer does
  profiles: {
    // The DASH profile supports adaptive streaming based on other profile definitions
    // Ensure that the `videoSize` for each subProfile has the same aspect ratio
    dash_mp4: {
      operation: 'dash',
      // At startup, each element of this array is transformed into the corresponding profile object
      subProfiles: ['transcode_high_mp4', 'transcode_mid_mp4', 'transcode_low_mp4', 'transcode_min_mp4'],
      // subProfiles: ['transcode_mid_mp4', 'transcode_low_mp4', 'transcode_min_mp4'],
      // subProfiles: ['transcode_min_mp4'], // when debugging, limiting to 'min' makes for quick transcoding
      contentType: 'application/dash+xml',
      ext: 'mpd',
      primary: true,
      multiFile: true,
      hlsProfile: 'hls_m3u8',
      manifestAssets: ['asset_dash_mp4@video@001.mpd'],
      additionalAssets: [/^media_\d+\.m3u8$/, /^asset_hls_m3u8@video@master\.m3u8$/]
    },

    // This is a stub profile, referenced above by `dash_mp4.hlsProfile`
    // It exists to represent that the dash_mp4 also creates the m3u8 playlist for the media,
    // enabling playback on Apple iOS devices and other clients that may support HLS but not DASH
    // It's a 'noop' (does nothing) because all the m3u8 files are created by the dash_mp4 profile
    hls_m3u8: {
      noop: true,
      primary: true,
      ext: 'm3u8',
      manifestAssets: ['asset_hls_m3u8@video@master.m3u8'],
      contentType: 'application/vnd.apple.mpegurl'
    },

    // The various transcode_ profiles create different versions of the video
    // so that the video player can serve up an appropriate selection of choices
    // to the browser
    transcode_high_mp4: {
      operation: 'transcode',
      enabled: false,
      videoCodec: 'libx264',
      videoSize: 'hd1080',
      videoBitrate: '2048k',
      frameRate: 30,
      audioCodec: 'aac',
      audioChannels: 2,
      audioRate: 44100,
      audioBitrate: '128k',
      ext: 'mp4',
      contentType: 'video/mp4',
      primary: true
    },
    transcode_mid_mp4: {
      from: 'transcode_high_mp4',
      videoBitrate: '1024k'
    },
    transcode_low_mp4: {
      from: 'transcode_mid_mp4',
      videoSize: 'hd720',
      videoBitrate: '384k',
      frameRate: 24,
      audioChannels: 1,
      audioBitrate: '64k'
    },
    transcode_min_mp4: {
      from: 'transcode_low_mp4',
      videoSize: '640x360',
      videoBitrate: '192k',
      audioBitrate: '48k'
    },

    // The thumbnails_ profiles produce thumbnail images for the video
    // the fps: '1/60' means produce grab the image every 60 seconds
    // because some videos are shorter than 60 seconds, there is another
    // set of first_thumbnail_ profiles to grab some screenshots of the video
    // just a few seconds from the start (the 'offset' property)
    thumbnail_small: {
      operation: 'thumbnails',
      size: 'vga',
      fps: '1/60',
      ext: 'jpg',
      contentType: 'image/jpeg',
      multiFile: true
    },
    first_thumbnail_small: {
      operation: 'firstThumbnail',
      size: 'vga',
      offset: 6,
      ext: 'jpg',
      contentType: 'image/jpeg'
    },
    thumbnail_medium: {
      from: 'thumbnail_small',
      size: 'hd720'
    },
    first_thumbnail_medium: {
      from: 'first_thumbnail_small',
      size: 'hd720'
    },
    thumbnail_large: {
      from: 'thumbnail_small',
      size: 'hd1080'
    },
    first_thumbnail_large: {
      from: 'first_thumbnail_small',
      size: 'hd1080'
    },

    // The vttTracks_copy profile copies vtt subtitles files from
    // source to destination, using standardized names
    vttTracks_copy: {
      operation: 'copyTextTracks',
      ext: 'vtt',
      contentType: 'text/vtt',
      multiFile: true // per-language subtitle files
    },
    // The srtTracks_copy profile copies srt subtitles files from
    // source to destination, using standardized names
    srtTracks_copy: {
      operation: 'copyTextTracks',
      ext: 'srt',
      contentType: 'application/x-subrip',
      multiFile: true // per-language subtitle files
    },
    // The srt2vttTracks profile creates a vtt file for each srt file
    // This vtt-from-srt file has a different name from the vtt file that may
    // have been copied by a copyTextTracks operation. This allows a web-player
    // to offer the viewer a choice of vtt tracks: the one that came with the video, or
    srt2vttTracks: {
      operation: 'srt2vttTracks',
      ext: 'vtt',
      contentType: 'text/vtt',
      multiFile: true // per-language subtitle files
    }
  },
  // from https://ffmpeg.org/ffmpeg-utils.html#Video-size
  ffmpeg_sizes: {
    ntsc: '720x480',
    pal: '720x576',
    qntsc: '352x240',
    qpal: '352x288',
    sntsc: '640x480',
    spal: '768x576',
    film: '352x240',
    'ntsc-film': '352x240',
    sqcif: '128x96',
    qcif: '176x144',
    cif: '352x288',
    '4cif': '704x576',
    '16cif': '1408x1152',
    qqvga: '160x120',
    qvga: '320x240',
    vga: '640x480',
    svga: '800x600',
    xga: '1024x768',
    uxga: '1600x1200',
    qxga: '2048x1536',
    sxga: '1280x1024',
    qsxga: '2560x2048',
    hsxga: '5120x4096',
    wvga: '852x480',
    wxga: '1366x768',
    wsxga: '1600x1024',
    wuxga: '1920x1200',
    woxga: '2560x1600',
    wqsxga: '3200x2048',
    wquxga: '3840x2400',
    whsxga: '6400x4096',
    whuxga: '7680x4800',
    cga: '320x200',
    ega: '640x350',
    hd480: '852x480',
    hd720: '1280x720',
    hd1080: '1920x1080',
    '2k': '2048x1080',
    '2kflat': '1998x1080',
    '2kscope': '2048x858',
    '4k': '4096x2160',
    '4kflat': '3996x2160',
    '4kscope': '4096x1716',
    nhd: '640x360',
    hqvga: '240x160',
    wqvga: '400x240',
    fwqvga: '432x240',
    hvga: '480x320',
    qhd: '960x540',
    '2kdci': '2048x1080',
    '4kdci': '4096x2160',
    uhd2160: '3840x2160',
    uhd4320: '7680x4320'
  }
}
