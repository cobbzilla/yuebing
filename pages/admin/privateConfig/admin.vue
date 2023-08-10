<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelPrivateConfigAdmin />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelPrivateConfigAdmin from "~/components/model/privateConfig/ModelPrivateConfigAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
