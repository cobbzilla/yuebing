<template>
  <v-container>
    <v-row v-if="showDetails">
      <v-col>
        <!--suppress TypeScriptUnresolvedReference -->
        <h2>{{ messages.title_media_setup }}</h2>
        <!--suppress TypeScriptUnresolvedReference -->
        <b>
          {{ messages.title_media_setup_details }}
        </b>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";
import { useMediaStore } from "~/stores/model/mediaStore";

const sessionStore = useSessionStore();
const { localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const mediaStore = useMediaStore();
const { mediaList } = storeToRefs(mediaStore);

const showDetails = ref(false);

watch(mediaList, (newList) => {
  if (newList && Array.isArray(newList) && newList.length > 0) {
    navigateTo("/admin/media/admin");
  } else {
    showDetails.value = true;
  }
});

mediaStore.search();
</script>
