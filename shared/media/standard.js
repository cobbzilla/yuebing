export default {

  name: 'standard',

  operations: {
    mediainfo: {
      minFileSize: 64 // 64 bytes, very conservative. Even an essentially empty file clocks in just over 2k
    }
  },

  profiles: {
    // The mediainfo profile runs the 'mediainfo' command on a media asset
    // and stores the output. The media player then has access to this info
    // See pages/media/video.vue for an example
    mediainfo_json: {
      operation: 'mediainfo',
      // this is the command to run, just happens to be the same as the operation name
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
      from: 'mediainfo_json', // inherits props from above, we redefine some for this profile
      ext: 'txt',
      contentType: 'text/plain',
      details: true
    }
  }
}
