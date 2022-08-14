export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  publicRuntimeConfig: {
    title: process.env.YB_TITLE || 'Yuebing 🥮',

    // Links in outbound emails will point back here
    siteUrl: process.env.YB_SITE_URL || 'http://127.0.0.1:3000',

    // Set to true to allow anonymous browsing/viewing
    // WARNING: This can generate expensive bandwidth bills, depending on your site's traffic load
    public: process.env.YB_PUBLIC ? !!JSON.parse(process.env.YB_PUBLIC) : false,

    // Set to true to allow people to sign up
    allowRegistration: process.env.YB_ALLOW_REGISTRATION ? !!JSON.parse(process.env.YB_ALLOW_REGISTRATION) : false,

    // If limitRegistration is set, the allowRegistration setting is ignored
    // The limitRegistration property can be either:
    // 1. A string representing a path on the destination bucket to a file containing a list of email
    //    addresses to allow registration from. The contents of this file can be a JSON array, or a flat
    //    text file with one email address per line
    // 2. An array object, containing the email addresses to allow registration from
    limitRegistration: process.env.YB_LIMIT_REGISTRATION || null,

    // To add support for a new locale:
    //  - Add the locale name to the 'locales' array below
    //  - For UI/API strings: copy shared/messages/en_US.js to shared/messages/<locale>.js and translate/adjust as needed
    //  - If email is enabled, copy the serverMiddleware/templates/email/en_US directory to a directory named after
    //    the new locale, then edit the files and translate/adjust as needed
    //  - If you're feeling extra nice, edit shared/messages/en_US.js (and all others) and add a translation for
    //    your new locale. This is for when your new locale appears a drop-down list, it will be translated
    //    into the user's language.
    locales: ['en_US', 'fr_FR'],
    defaultLocale: process.env.YB_DEFAULT_LOCALE || 'en_US',

    // timeouts for various temporary tokens stored in redis
    timeout: {
      verify: process.env.YB_TIMEOUT_ACCOUNT_VERIFICATION || 1000 * 60 * 60 * 24 * 2, // 2 days
      resetPassword: process.env.YB_TIMEOUT_RESET_PASSWORD || 1000 * 60 * 60 // 1 hour
    },

    // Don't change this line. If you want to enable email, set the YB_EMAIL_HOST environment
    // variable (and others, see below in privateRuntimeConfig for email settings)
    emailEnabled: (typeof process.env.YB_EMAIL_HOST === 'string' && process.env.YB_EMAIL_HOST.length > 0)
  },

  privateRuntimeConfig: {
    // Initial admin user. Set the password to create the admin user
    admin: {
      user: {
        email: process.env.YB_ADMIN_EMAIL || 'admin@example.local',
        password: process.env.YB_ADMIN_PASSWORD || null,
        locale: process.env.YB_ADMIN_LOCALE || process.env.YB_DEFAULT_LOCALE || 'en_US'
      },
      overwrite: !!process.env.YB_ADMIN_OVERWRITE // set to true to overwrite existing admin user
    },

    // SMTP settings for sending email
    // If host is not set, emails will be disabled
    // Do not set edit the lines below.
    // Instead, set the YB_EMAIL environment variables to the config you want
    email: {
      host: process.env.YB_EMAIL_HOST || null,
      port: process.env.YB_EMAIL_PORT || 587,
      user: process.env.YB_EMAIL_USER || null,
      password: process.env.YB_EMAIL_PASSWORD || null,
      secure: process.env.YB_EMAIL_SECURE || true,
      fromEmail: process.env.YB_EMAIL_FROM || 'nobody@localhost'
    },

    // redis is used for: server-side caching, the xform job queue, and web sessions
    redis: {
      host: process.env.YB_REDIS_HOST || '127.0.0.1',
      port: process.env.YB_REDIS_PORT || 6379,

      // set to true to flush redis when the app starts (this will log out all users)
      flushAtStartup: process.env.YB_REDIS_FLUSH_AT_STARTUP ? !!JSON.parse(process.env.YB_REDIS_FLUSH_AT_STARTUP) : false,

      // Cache duration for listings from S3, in milliseconds
      listingCacheExpiration: process.env.YB_S3_LIST_CACHE_EXPIRATION || 5 * 60 * 1000, // default 5 minutes

      // Cache duration for manifests, in milliseconds
      // Note that manifests will only be recalculated if the Last-Modified header of the `lastModified`
      // file is newer than the cache's ctime
      manifestCacheExpiration: process.env.YB_S3_MANIFEST_CACHE_EXPIRATION || 60 * 1000 // default 1 minute
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
      //
      // WARNING: if you change this, your user-storage location will be different, so
      // existing users will no longer be able to sign in. Login as admin and visit
      // the /admin/rotateKey page to migrate old users to the new encryption key
      key: process.env.YB_USERDATA_KEY,
      iv: process.env.YB_USERDATA_IV, // IV is optional, will be derived from key if empty

      // Passwords are stored as bcrypt hashes. How many rounds to use
      bcryptRounds: process.env.YB_BCRYPT_ROUNDS || 12
    },

    session: {
      // How long web sessions last
      expiration: process.env.YB_SESSION_EXPIRATION || 1000 * 60 * 60 * 24 // default 24 hours
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
      interval: process.env.YB_AUTOSCAN_INTERVAL || 1000 * 60 * 60 * 24, // default 24 hours

      // How long to wait before the initial startup scan
      // Zero or negative means disable initial scan
      // Minimum interval is 5 seconds. Lower settings are ignored.
      initialDelay: process.env.YB_AUTOSCAN_INITIAL_DELAY || 1000 * 30, // default 30 seconds

      // Show stdout/stderr from transform commands? It is a LOT of output (ffmpeg for example)
      showTransformOutput: false,

      // How many concurrent transformations can be done
      concurrency: process.env.YB_XFORM_CONCURRENCY || 2
    }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.YB_TITLE,
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

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'Sign In',
        path: '/signIn',
        component: resolve(__dirname, 'pages/auth/login.vue'),
        chunkName: 'pages/auth/login'
      })
      routes.push({
        name: 'Sign Up',
        path: '/signUp',
        component: resolve(__dirname, 'pages/auth/register.vue'),
        chunkName: 'pages/auth/register'
      })
      routes.push({
        name: 'Request Password Reset',
        path: '/reset',
        component: resolve(__dirname, 'pages/auth/requestPasswordReset.vue'),
        chunkName: 'pages/auth/requestPasswordReset'
      })
      routes.push({
        name: 'Verify',
        path: require(resolve(__dirname, 'shared/auth')).VERIFY_ENDPOINT,
        component: resolve(__dirname, 'pages/auth/verify.vue'),
        chunkName: 'pages/auth/verify'
      })
      routes.push({
        name: 'Account Profile',
        path: '/profile',
        component: resolve(__dirname, 'pages/auth/profile.vue'),
        chunkName: 'pages/auth/profile'
      })
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vee-validate.js'
  ],

  // Don't load serverMiddleware here -- it's loaded via 'modules/api' below
  // Loading the serverMiddleware during 'nuxt build' causes a nasty build warning message
  // See: https://github.com/nuxt/nuxt.js/issues/5669#issuecomment-491241150
  // serverMiddleware: [],

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
    '@nuxtjs/axios',
    // this module loads the serverMiddleware when nuxt runs, but does not load it during 'nuxt build'
    '~/modules/api'
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
