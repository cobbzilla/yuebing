<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelMediaProfileAdmin
            delete-confirmation-message="admin_label_mediaProfile_confirm_delete"
            :label-prefixes="['admin_label_mediaProfile_', 'label_mediaProfile_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelMediaProfileAdmin from "~/components/model/mediaProfile/ModelMediaProfileAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
