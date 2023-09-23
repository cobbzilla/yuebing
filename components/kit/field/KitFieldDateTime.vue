<template>
  <v-container>
    <v-row>
      <v-col>
        <b>{{ fieldLabel }}</b>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-date-picker
          v-model="date"
          name="date"
          class="form-control"
          @update:model-value="sendUpdate">
        </v-date-picker>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="hour"
          :label="messages.label_hour"
          :items="[...Array(24).keys()]"
          :full-width="false"
          name="hour"
          class="form-control"
          @update:model-value="sendUpdate"
        />
      </v-col>
      <v-col>
        <v-select
          v-model="minute"
          :label="messages.label_minute"
          :items="[...Array(60).keys()]"
          :full-width="false"
          name="minute"
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

const date = ref(new Date(props.fieldValue));
const hour = ref(Math.floor((props.fieldValue % DAYS_MILLIS) / HOURS_MILLIS));
const minute = ref(Math.floor((props.fieldValue % HOURS_MILLIS) / MINUTES_MILLIS));

const sendUpdate = () => {
  const dateAndTime = date.value.getDate() + (HOURS_MILLIS * hour.value) + (MINUTES_MILLIS * minute.value);
  emit("update", dateAndTime);
};
</script>
