export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  publicRuntimeConfig: {
    title: process.env.SV_TITLE || 's3vid',

    // Set to true to allow anonymous browsing/viewing
    public: process.env.SV_PUBLIC ? !!JSON.parse(process.env.SV_PUBLIC) : false,

    // Set to true to allow people to sign up
    allowRegistration: process.env.SV_ALLOW_REGISTRATION ? !!JSON.parse(process.env.SV_ALLOW_REGISTRATION) : false
  },

  privateRuntimeConfig: {
    // Initial admin user. Set the password to create the admin user
    admin: {
      user: {
        username: process.env.SV_ADMIN_USER || 'admin',
        password: process.env.SV_ADMIN_PASSWORD || null
      },
      overwrite: true // set to true to overwrite existing username
    },

    // redis is used for: server-side caching, the xform job queue, and web sessions
    redis: {
      host: process.env.SV_REDIS_HOST || '127.0.0.1',
      port: process.env.SV_REDIS_PORT || 6379
    },

    // A map of supported (media type) -> (config for the media type)
    //
    // The existence of a mediaType named 'foo' implies that there exists:
    //  * A specification in 'shared/media/foo.js' to determine which files match and what to do with them
    //  * A page in 'pages/media/foo.vue' to display an individual media item with type foo
    //  * A driver in 'serverMiddleware/asset/driver/foo.js' that generates assets from a source of type foo
    //    - The driver must export a functions named after each operation that the driver supports
    //      See serverMiddleware/asset/driver/video.js for an example.
    //
    media: {
      video: {
        // 'allowedCommands' is a list of programs the driver is allowed to run.
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

      // Show stdout/stderr from transform commands? It is a LOT of output (ffmpeg for example)
      showTransformOutput: false,

      // How many concurrent transformations can be done
      concurrency: process.env.SV_XFORM_CONCURRENCY || 2
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
    '~/serverMiddleware/api/user',
    '~/serverMiddleware/api/user/authenticate',
    '~/serverMiddleware/api/user/register',
    '~/serverMiddleware/api/s3/list',
    '~/serverMiddleware/api/s3/scan',
    '~/serverMiddleware/api/s3/meta',
    '~/serverMiddleware/api/s3/proxy',
    '~/serverMiddleware/api/asset/queue'
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
