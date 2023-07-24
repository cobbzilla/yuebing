<template>
  <v-app dark>
    <v-container>
      <SiteHeader />
    </v-container>
    <v-main>
      <v-container fluid fill-height>
        <slot />
      </v-container>
    </v-main>
    <v-footer>
      <SiteFooter />
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useConfigStore } from "~/stores/config";
import { DEFAULT_META } from "~/utils/meta";

const config = useConfigStore();
const configRefs = storeToRefs(config);
config.loadBrowserHeaders();

useSeoMeta({
  title: () => {
    return configRefs?.publicConfig?.value?.title || "⌛🥮";
  },
  ...DEFAULT_META,
});
</script>

<script lang="ts">
export default {
  head: {},
};
</script>
