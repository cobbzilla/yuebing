<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelPublicConfigAdmin />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";
import ModelPublicConfigAdmin from "~/components/model/publicConfig/ModelPublicConfigAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
