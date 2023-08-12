<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelLocalConfigAdmin
          :label-prefixes="labelPrefixes"
          @add-canceled="close"
          @added="close"
          @edit-canceled="close"
          @edited="close"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import ModelLocalConfigAdmin from "~/components/model/localConfig/ModelLocalConfigAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);

const close = () => navigateTo("/admin");

const labelPrefixes = [
  'admin_label_privateConfig_',
  'admin_label_privateConfig_autoscan_',
  'label_',
  ''
];
</script>
