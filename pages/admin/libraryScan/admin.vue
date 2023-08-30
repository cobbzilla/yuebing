<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelLibraryScanAdmin
          :can-add="() => false"
          :can-delete="() => false"
          delete-confirmation-message=""
          :label-prefixes="['admin_label_libraryScan_', 'label_libraryScan_', 'label_scan_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelLibraryScanAdmin from "~/components/model/libraryScan/ModelLibraryScanAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
