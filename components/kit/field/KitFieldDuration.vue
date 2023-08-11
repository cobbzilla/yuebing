<template>
  <v-container>
    <v-row>
      <v-col>
        <b>{{ fieldLabel }}</b>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="days"
          :label="messages.label_duration_days"
          :items="[...Array(365).keys()]"
          :full-width="false"
          :hint="hint"
          persistent-hint
          name="days"
          class="form-control"
          @update:model-value="sendUpdate"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="hours"
          :label="messages.label_duration_hours"
          :items="[...Array(24).keys()]"
          :full-width="false"
          name="hours"
          class="form-control"
          @update:model-value="sendUpdate"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="minutes"
          :label="messages.label_duration_minutes"
          :items="[...Array(60).keys()]"
          :full-width="false"
          name="minutes"
          class="form-control"
          @update:model-value="sendUpdate"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/sessionStore";

const MINUTES_MILLIS = 1000 * 60
const HOURS_MILLIS = MINUTES_MILLIS * 60
const DAYS_MILLIS = HOURS_MILLIS * 24

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const props = withDefaults(
    defineProps<{
      fieldLabel: string;
      fieldValue: number;
      fieldErrorMessage: string;
      hint?: string;
      labelPrefixes: string[];
    }>(),
    {
      fieldValue: () => 0,
      labelPrefixes: () => ["label_", ""],
      hint: () => "",
    },
);

const emit = defineEmits<{
  update: [value: number];
}>();

const days = ref(Math.floor(props.fieldValue / DAYS_MILLIS));
const hours = ref(Math.floor((props.fieldValue % DAYS_MILLIS) / HOURS_MILLIS));
const minutes = ref(Math.floor((props.fieldValue % HOURS_MILLIS) / MINUTES_MILLIS));

const sendUpdate = () => {
  const duration = (DAYS_MILLIS * days.value) + (HOURS_MILLIS * hours.value) + (MINUTES_MILLIS * minutes.value);
  emit("update", duration);
};
</script>
