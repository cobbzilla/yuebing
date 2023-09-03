<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelLibraryAdmin
            delete-confirmation-message="admin_label_confirm_library_delete"
            :label-prefixes="['admin_label_library_', 'label_media_', 'label_']"
            :action-configs="actionConfigs"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelLibraryAdmin from "~/components/model/library/ModelLibraryAdmin.vue";
import { ActionConfig } from "~/utils/model/adminHelper";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);

const actionConfigs: Record<string, ActionConfig> = {
  startScan: {
    path: '/admin/library/[id]/scan',
    message: 'admin_label_library_action_scan',
    icon: 'ScanIcon'
  }
};
</script>
