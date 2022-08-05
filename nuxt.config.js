export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  publicRuntimeConfig: {
    title: process.env.SV_TITLE || 's3vid'
  },

  privateRuntimeConfig: {
    // optional, define these to encrypt user data stored on destination bucket
    userEncryptionKey: process.env.SV_USERDATA_KEY,
    userEncryptionIV: process.env.SV_USERDATA_IV,
    sessionExpiration: process.env.SV_SESSION_EXPIRATION || 1000 * 60 * 60 * 24 // default 24 hours
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
    { path: '/s3/proxy', handler: '~/serverMiddleware/s3/proxy' }
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
