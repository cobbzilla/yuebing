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

<script lang="ts">
export default {
  head: {},
};
</script>

<script setup lang="ts">
import { useConfigStore } from "~/stores/config";
import { storeToRefs } from "pinia";
import { DEFAULT_META } from "~/utils/meta";

const config = useConfigStore();
const configRefs = storeToRefs(config);
config.loadPublicConfig();

useSeoMeta({
  title: () => {
    return configRefs?.publicConfig?.value?.title || "⌛🥮";
  },
  ...DEFAULT_META,
});
</script>
