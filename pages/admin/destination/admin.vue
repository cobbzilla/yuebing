<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelDestinationAdmin
            delete-confirmation-message="admin_label_destination_confirm_delete"
            :label-prefixes="['label_destinationType_', 'label_volumeType_', 'label_']"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelDestinationAdmin from "~/components/model/destination/ModelDestinationAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);
</script>
