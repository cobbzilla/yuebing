// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "pathe";

const registerFile = resolve(__dirname, "./pages/auth/register.vue");
const loginFile = resolve(__dirname, "./pages/auth/login.vue");

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@pinia/nuxt","nuxt-icon"],
  build: {
    transpile: ["vuetify"],
  },
  hooks: {
    "pages:extend"(pages) {
      pages.push(
        {
          name: "setup",
          path: "/setup",
          file: registerFile,
        },
        {
          name: "signUp",
          path: "/signUp",
          file: registerFile,
        },
        {
          name: "signup",
          path: "/signup",
          file: registerFile,
        },
        {
          name: "register",
          path: "/register",
          file: registerFile,
        },
        {
          name: "login",
          path: "/login",
          file: loginFile,
        },
        {
          name: "signIn",
          path: "/signIn",
          file: loginFile,
        },
        {
          name: "signin",
          path: "/signin",
          file: loginFile,
        },
      );
    },
  },
  // vite: {
  //   optimizeDeps: {
  //     esbuildOptions: {
  //       define: {
  //         // global: "globalThis",
  //       },
  //     },
  //   },
  // },
});
