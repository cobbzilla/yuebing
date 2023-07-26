// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@pinia/nuxt"],
  build: {
    transpile: ["vuetify"],
  },
  alias: {
    "/login": "/auth/login",
    "/signIn": "/auth/login",
    "/signin": "/auth/login",
    "/register": "/auth/register",
    "/signUp": "/auth/register",
    "/signup": "/auth/register",
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
