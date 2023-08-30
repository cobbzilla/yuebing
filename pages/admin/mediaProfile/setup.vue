<template>
  <v-container>
    <v-row v-if="showDetails">
      <v-col>
        <!--suppress TypeScriptUnresolvedReference -->
        <h2>{{ messages.title_mediaProfile_setup }}</h2>
        <!--suppress TypeScriptUnresolvedReference -->
        <b>
          {{ messages.title_mediaProfile_setup_details }}
        </b>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import { useMediaProfileStore } from "~/stores/model/mediaProfileStore";

const sessionStore = useSessionStore();
const { localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const mediaProfileStore = useMediaProfileStore();
const { mediaProfileList } = storeToRefs(mediaProfileStore);

const showDetails = ref(false);

watch(mediaProfileList, (newList) => {
  if (newList && Array.isArray(newList) && newList.length > 0) {
    navigateTo("/admin/mediaProfile/admin");
  } else {
    showDetails.value = true;
  }
});

mediaProfileStore.search();
</script>
