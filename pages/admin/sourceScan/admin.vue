<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelSourceScanAdmin
          :can-add="() => false"
          :can-delete="() => false"
          delete-confirmation-message=""
          :label-prefixes="['admin_label_sourceScan_', 'label_sourceScan_', 'label_scan_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelSourceScanAdmin from "~/components/model/SourceScan/ModelSourceScanAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
