<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelSourceAdmin
            delete-confirmation-message="admin_label_source_confirm_delete"
            :label-prefixes="['label_sourceType_', 'label_volumeType_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";
import ModelSourceAdmin from "~/components/model/source/ModelSourceAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
