<template>
  <v-container>
    <v-row>
      <v-col>
        <b>{{ messages[fieldLabel] }}</b>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          v-model="days"
          :label="messages.label_duration_days"
          :items="[...Array(365).keys()]"
          :full-width="false"
          name="days"
          class="form-control"
          @change="$emit('update', {field, value: durationValue})"
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
          @change="$emit('update', {field, value: durationValue})"
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
          @change="$emit('update', {field, value: durationValue})"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'

const MINUTES_MILLIS = 1000 * 60
const HOURS_MILLIS = MINUTES_MILLIS * 60
const DAYS_MILLIS = HOURS_MILLIS * 24

export default {
  name: 'DurationField',
  props: {
    field: { type: String, default: null },
    fieldLabel: { type: String, default: null },
    fieldValue: { type: Number, default: null },
    fieldRules: { type: String, default: null }
  },
  data () {
    return {
      days: null,
      hours: null,
      minutes: null
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    durationValue () {
      return ((this.days ? this.days : 0) * DAYS_MILLIS) +
        ((this.hours ? this.hours : 0) * HOURS_MILLIS) +
        ((this.minutes ? this.minutes : 0) * MINUTES_MILLIS)
    }
  },
  created () {
    this.days = Math.floor(this.fieldValue / DAYS_MILLIS)
    this.hours = Math.floor((this.fieldValue % DAYS_MILLIS) / HOURS_MILLIS)
    this.minutes = Math.floor((this.fieldValue % HOURS_MILLIS) / MINUTES_MILLIS)
  },
  methods: {
    fieldError (error) {
      return error ? fieldErrorMessage(this.fieldLabel, error, this.messages, '') : '(no message)'
    }
  }
}
</script>
