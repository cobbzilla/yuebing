// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@pinia/nuxt", "@vee-validate/nuxt"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
  },
});
