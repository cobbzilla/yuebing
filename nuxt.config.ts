// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "pathe";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@pinia/nuxt"],
  build: {
    transpile: ["vuetify"],
  },
  hooks: {
    "pages:extend"(pages) {
      pages.push(
        {
          name: "setup",
          path: "/setup",
          file: resolve(__dirname, "./pages/auth/register.vue"),
        },
        {
          name: "signUp",
          path: "/signUp",
          file: resolve(__dirname, "./pages/auth/register.vue"),
        },
        {
          name: "signup",
          path: "/signup",
          file: resolve(__dirname, "./pages/auth/register.vue"),
        },
        {
          name: "register",
          path: "/register",
          file: resolve(__dirname, "./pages/auth/register.vue"),
        },
        {
          name: "login",
          path: "/login",
          file: resolve(__dirname, "./pages/auth/login.vue"),
        },
        {
          name: "signIn",
          path: "/signIn",
          file: resolve(__dirname, "./pages/auth/login.vue"),
        },
        {
          name: "signin",
          path: "/signin",
          file: resolve(__dirname, "./pages/auth/login.vue"),
        },
      );
    },
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
