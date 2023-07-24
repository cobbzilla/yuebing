<template>
  <v-container v-if="publicConfig?.needsAdmin"> </v-container>
  <v-container v-else>
    <v-row>
      index page is here! and publicConfig.needsAdmin={{ publicConfig?.needsAdmin }}
      <!--      <ListObjects/>-->
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// import { storeToRefs } from "pinia";
// import { useSessionStore } from "~/stores/session";
// import { useConfigStore } from "~/stores/config";

// const session = storeToRefs(useSessionStore());
// const messages = ref(session.localeMessages);

// const config = storeToRefs(useConfigStore());
// const publicConfig = ref(config.publicConfig);
</script>
