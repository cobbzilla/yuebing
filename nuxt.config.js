export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  publicRuntimeConfig: {
    title: process.env.SV_TITLE
  },

  privateRuntimeConfig: {
    source: {
      bucket: process.env.SV_SOURCE_BUCKET,
      access: process.env.SV_SOURCE_ACCESS,
      secret: process.env.SV_SOURCE_SECRET
    },
    dest: {
      bucket: process.env.SV_DEST_BUCKET,
      access: process.env.SV_DEST_ACCESS,
      secret: process.env.SV_DEST_SECRET
    },
    admin: {
      username: process.env.SV_ADMIN_USER,
      password: process.env.SV_ADMIN_PASSWORD
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
    { path: '/s3/list', handler: '~/serverMiddleware/s3/list' }
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
