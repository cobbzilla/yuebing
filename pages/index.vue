<template>
  <!--  <v-container v-if="publicConfig?.needsAdmin"> </v-container>-->
  <!--  <v-container v-else>-->
  <v-container>
    <v-row> index page is here </v-row>
  </v-container>
</template>

<script setup lang="ts">
// import { storeToRefs } from "pinia";
// import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";

// const session = storeToRefs(useSessionStore());
// const messages = ref(session.localeMessages);

const configStore = useConfigStore();
// const config = storeToRefs(configStore);
// const publicConfig = ref(config.publicConfig);
if ((await configStore.loadPublicConfig())?.needsAdmin === true) {
  navigateTo("/auth/register2");
}
</script>
