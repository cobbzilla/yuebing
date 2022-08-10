export default {

  name: 'standard',

  operations: {
    mediainfo: {
      minFileSize: 512 // 512 bytes, very conservative. Even an essentially empty file clocks in just over 2k
    }
  },

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
    }
  }
}
