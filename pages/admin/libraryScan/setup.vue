<template>
  <v-container>
    <v-row>
      <v-col>
        <Icon name="LoadingIcon" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// If the last libraryScan is deleted, we end up here -- just go to the libraries view
navigateTo("/admin/library/admin");
</script>
