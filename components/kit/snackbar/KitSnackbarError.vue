<template>
  <KitSnackbar :show="props.show" :text="props.text" color="#b22222" />
</template>

<script setup lang="ts">
import KitSnackbar from "~/components/kit/snackbar/KitSnackbar.vue";
const props = withDefaults(
  defineProps<{
    show: boolean | null;
    text: string;
  }>(),
  {
    show: () => true,
  },
);
</script>
