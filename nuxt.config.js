export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  publicRuntimeConfig: {
    title: process.env.SV_TITLE
  },

  privateRuntimeConfig: {
    admin: {
      username: process.env.SV_ADMIN_USER,
      password: process.env.SV_ADMIN_PASSWORD
    },
    serverId: Math.floor(10000000000 * Math.random()),
    media: {
      video: {
        ext: ['mp4', 'm4v', 'avi', 'mpg', 'mpeg', 'mov', 'webm', 'mkv', 'flv', '3gp'],
        operations: {
          transcode: {
            minFileSize: 1024 * 128 // 128k min valid size
          },
          thumbnails: {
            minFileSize: 64 // 64 bytes min valid size
          },
          firstThumbnail: {
            minFileSize: 64 // 64 bytes min valid size
          }
        },
        profiles: {
          transcode_min_mp4: {
            operation: 'transcode',
            videoCodec: 'libx264',
            videoSize: 'hd1080',
            videoBitrate: '128k',
            frameRate: 30,
            audioCodec: 'aac',
            audioChannels: 2,
            audioRate: 44100,
            audioBitrate: '128k',
            ext: 'mp4',
            sufficient: true
          },
          thumbnail_small: {
            operation: 'thumbnails',
            size: 'vga',
            fps: '1/60',
            ext: 'jpg',
            multiFile: true
          },
          first_thumbnail_small: {
            operation: 'firstThumbnail',
            size: 'vga',
            ext: 'jpg',
            offset: 8
          }
        }
        // profiles: {
        //   high: { videoSize: 'hd1080', frameRate: 30, videoBitrate: '1024k' },
        //   mid: { videoSize: 'hd720', frameRate: 24, videoBitrate: '512k' },
        //   low: { videoSize: 'vga', frameRate: 24, videoBitrate: '384k', audioChannels: 1, audioBitrate: '64k' },
        //   min: { videoSize: 'vga', frameRate: 24, videoBitrate: '128k', audioChannels: 1, audioBitrate: '64k' }
        // },
        // thumbnails: {
        //   large: { size: 'hd1080', fps: '1/60' },
        //   medium: { size: 'hd720', fps: '1/60' },
        //   small: { size: 'vga', fps: '1/60' }
        // }
      }
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.SV_TITLE,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  serverMiddleware: [
    { path: '/s3/list', handler: '~/serverMiddleware/s3/list' },
    { path: '/s3/scan', handler: '~/serverMiddleware/s3/scan' },
    { path: '/s3/meta', handler: '~/serverMiddleware/s3/meta' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
