export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  publicRuntimeConfig: {
    title: process.env.SV_TITLE || 's3vid'
  },

  privateRuntimeConfig: {

    // redis is used for server-side caching, the xform job queue, and web sessions
    redis: {
      host: process.env.SV_REDIS_HOST || '127.0.0.1',
      port: process.env.SV_REDIS_PORT || 6379
    },

    // A map of supported (media type) -> (config for the media type)
    //
    // The existence of a mediaType named 'foo' implies that there exists:
    //  * A specification in 'shared/media/foo.js' to determine which files match and what to do with them
    //  * A page in 'pages/media/foo.vue' to display an individual media item with type foo
    //  * A driver in 'serverMiddleware/driver/foo.js' that generates derived assets from a source of type foo
    //    - The driver must export a functions named after each operation that the driver supports
    //      See serverMiddleware/driver/video.js for an example.
    //
    media: {
      video: {
        // 'allowedCommands' is a list of shell commands the driver is allowed to run.
        //
        // The first command listed is the default command and will be used for any profiles that
        // do not specify a 'command' property.
        //
        // All drivers are allowed to run 'mediainfo', that does not need to be listed.
        // Anything that looks like a shell will fail validation (bash/zsh/ssh/etc)
        allowedCommands: ['ffmpeg']
      }
    },

    userEncryption: {
      // Optional. Define these to encrypt user data stored on destination bucket
      key: process.env.SV_USERDATA_KEY,
      iv: process.env.SV_USERDATA_IV,

      // Passwords are stored as bcrypt hashes. How many rounds to use
      bcryptRounds: process.env.SV_BCRYPT_ROUNDS || 12
    },

    session: {
      // How long web sessions last
      expiration: process.env.SV_SESSION_EXPIRATION || 1000 * 60 * 60 * 24 // default 24 hours
    },

    // The server scans the source media for new content to transform
    autoscan: {
      // How frequently to auto-scan the source for new content
      // Zero or negative means disable auto scanning
      // Otherwise, scan at this interval.
      // Minimum interval is 1 minute. Lower settings are ignored.
      // Only one scan runs at a time. If an active scan is already running when a new
      // interval is triggered, a concurrent scan will NOT be started.
      // If enabled, an initial scan will being shortly after startup
      interval: process.env.SV_AUTOSCAN_INTERVAL || 1000 * 60 * 60 * 24, // default 24 hours

      // How long to wait before the initial startup scan
      // Zero or negative means disable initial scan
      // Minimum interval is 5 seconds. Lower settings are ignored.
      initialDelay: process.env.SV_INITIAL_SCAN_DELAY || 1000 * 30, // default 30 seconds

      // show stdout/stderr from transform commands?
      showTransformOutput: false
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
    '~/plugins/vee-validate.js'
  ],

  serverMiddleware: [
    { path: '/user', handler: '~/serverMiddleware/user' },
    { path: '/user/authenticate', handler: '~/serverMiddleware/user/authenticate' },
    { path: '/user/register', handler: '~/serverMiddleware/user/register' },
    { path: '/s3/list', handler: '~/serverMiddleware/s3/list' },
    { path: '/s3/scan', handler: '~/serverMiddleware/s3/scan' },
    { path: '/s3/meta', handler: '~/serverMiddleware/s3/meta' },
    { path: '/s3/proxy', handler: '~/serverMiddleware/s3/proxy' },
    { path: '/asset/queue', handler: '~/serverMiddleware/asset/queue' }
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
    transpile: ['vee-validate/dist/rules']
  }
}
