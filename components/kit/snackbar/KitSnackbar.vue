<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-if="props.show"
      v-model="snackbar"
      :timeout="props.timeout"
    >
      {{ text }}
      <template #actions>
        <v-btn
          :color="props.color"
          variant="text"
          @click="snackbar = false"
        >
          <Icon name="material-symbols:close" />
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean | null;
    text: string;
    color: string;
    timeout: number;
  }>(),
  {
    show: () => null,
    color: () => "#d3d3d3",
    timeout: () => 30000,
  },
);

const snackbar = ref(props.show);
</script>
