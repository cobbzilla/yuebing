<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelLibraryAdmin
            delete-confirmation-message="admin_label_confirm_library_delete"
            :label-prefixes="['admin_label_library_', 'label_media_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";
import ModelLibraryAdmin from "~/components/model/library/ModelLibraryAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
