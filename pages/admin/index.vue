<template>
  <v-container>
    <v-row>
      <v-col><b>admin home</b></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useLibraryStore } from "~/stores/model/libraryStore";
import { storeToRefs } from "pinia";

const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);
libraryStore.librarySearch();

watch(libraryList, (libraries) => {
  if (libraries.length === 0) {
    navigateTo("/admin/source/setup");
  }
});
</script>
