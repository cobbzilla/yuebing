<template>
  <v-container>
    <v-row>
      <v-col><b>admin home</b></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useLibraryStore } from "~/stores/model/libraryStore";
import {FIND_FIRST} from "mobiletto-orm-typedef";

const libraryStore = useLibraryStore();
libraryStore.librarySearch({predicate: FIND_FIRST})
</script>
