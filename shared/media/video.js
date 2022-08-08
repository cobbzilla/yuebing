export default {

  name: 'video',

  // Source assets with these extensions will be filtered onto the destination
  ext: ['mp4', 'm4v', 'avi', 'mpg', 'mpeg', 'mov', 'webm', 'mkv', 'flv', '3gp'],

  // Configuration params for the supported operations
  // Currently the video transformer only uses these to verify that
  // the assets created have some minimum size to be considered valid
  // It's a very rudimentary check. Better validation of final assets would be great
  operations: {
    mediainfo: {
      minFileSize: 512 // 512 bytes, very conservative. Even an essentially empty file clocks in just over 2k
    },
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
    }
  },

  // Each profile can produce one asset, or many assets
  // the existence of at least one 'primary' asset is required for
  // an object to be considered "ready" for viewing in the webapp.
  // The 'operation' field determines what the media-specific transformer does
  profiles: {

    // The mediainfo profile runs the 'mediainfo' command on the video
    // and stores the output. The video player then has access to this info
    mediainfo_json: {
      operation: 'mediainfo',
      // The default video command is 'ffmpeg', so override that here
      // Arbitrary command execution not allowed, see ~/serverMiddleware/asset/video.js#runTransformCommand
      command: 'mediainfo',
      ext: 'json',
      contentType: 'application/json',
      outfile: 'stdout',
      full: true
    },

    // If you set details to true, mediainfo uses a text format
    // So ext is 'txt' and contentType is 'text/plain'
    // The 'full' flag is ignored when 'details' is true
    mediainfo_details: {
      from: 'mediainfo_json', // inherit props from above
      ext: 'txt',
      contentType: 'application/json',
      details: true
    },

    // The various transcode_ profiles create different versions of the video
    // so that the video player can serve up an appropriate selection of choices
    // to the browser

    // The DASH profile supports adaptive streaming based on other profile definitions
    dash_mp4: {
      operation: 'dash',
      // At startup, each element of this array is transformed into the corresponding profile object
      // subProfiles: ['transcode_high_mp4', 'transcode_mid_mp4', 'transcode_low_mp4', 'transcode_min_mp4'],
      subProfiles: ['transcode_low_mp4', 'transcode_min_mp4'], // when debugging, limiting to 'min' makes for quick transcoding
      contentType: 'application/dash+xml',
      ext: 'mpd',
      primary: true,
      multiFile: true
    },

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
      videoSize: 'vga',
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
    }
  }
}
