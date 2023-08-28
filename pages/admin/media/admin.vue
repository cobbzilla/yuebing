<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelMediaAdmin
            :can-add="() => false"
            :can-delete="() => false"
            delete-confirmation-message=""
            :label-prefixes="['admin_label_media_', 'label_media_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelMediaAdmin from "~/components/model/media/ModelMediaAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
