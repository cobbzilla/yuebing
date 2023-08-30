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
// We should never get here, because an admin cannot delete themselves, but just in case.
// If we do get here, this means we have no admins, so go back to initial setup
navigateTo("/setup");
</script>
