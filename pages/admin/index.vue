<template>
  <v-container>
    <v-row>
      <v-col><b>admin home</b></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useLibraryStore } from "~/stores/model/libraryStore";
import { LibraryType } from "yuebing-model";

const libraryStore = useLibraryStore();
libraryStore.librarySearch().then((libraries: LibraryType[]) => {
  if (libraries.length === 0) {
    navigateTo("/admin/library/setup");
  }
});
</script>
