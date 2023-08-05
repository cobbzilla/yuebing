<template>
  <v-container>
    <v-row>
      <v-col><b>admin home</b></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useLibraryStore } from "~/stores/model/libraryStore";

const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);
libraryStore.search();

watch(libraryList, (libraries) => {
  if (libraries && libraries.length === 0) {
    navigateTo("/admin/source/setup");
  }
});
</script>
