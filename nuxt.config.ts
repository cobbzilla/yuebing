// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "pathe";

const registerFile = resolve(__dirname, "./pages/auth/register.vue");
const loginFile = resolve(__dirname, "./pages/auth/login.vue");

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: ["@pinia/nuxt", "nuxt-icon"],
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
  //   resolve: {
  //     alias: {
  //       "mobiletto-common": "rollup-plugin-node-polyfills/polyfills/empty",
  //       "mobiletto-base": "rollup-plugin-node-polyfills/polyfills/empty",
  //       ioredis: "rollup-plugin-node-polyfills/polyfills/empty",
  //       crypto: "rollup-plugin-node-polyfills/polyfills/empty",
  //       path: "rollup-plugin-node-polyfills/polyfills/empty",
  //       stream: "rollup-plugin-node-polyfills/polyfills/empty",
  //       fs: "rollup-plugin-node-polyfills/polyfills/empty",
  //       net: "rollup-plugin-node-polyfills/polyfills/empty",
  //       tls: "rollup-plugin-node-polyfills/polyfills/empty",
  //       url: "rollup-plugin-node-polyfills/polyfills/empty",
  //       dns: "rollup-plugin-node-polyfills/polyfills/empty",
  //       child_process: "rollup-plugin-node-polyfills/polyfills/empty",
  //       worker_threads: "rollup-plugin-node-polyfills/polyfills/empty",
  //       bullmq: "rollup-plugin-node-polyfills/polyfills/empty",
  //     },
  //   },
  // },
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
