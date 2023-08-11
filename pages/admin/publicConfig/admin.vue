<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelPublicConfigAdmin
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
import ModelPublicConfigAdmin from "~/components/model/publicConfig/ModelPublicConfigAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);

const close = () => navigateTo("/admin");
</script>
