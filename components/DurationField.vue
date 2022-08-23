<template>
  <v-container>
    <ValidationProvider v-slot="{ errors }" :name="options.field" :rules="options.fieldRules" immediate>
      <v-row>
        <v-col>
          <b>{{ messages[options.fieldLabel] }}</b>
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
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <span v-show="errors.length>0" class="is-invalid">{{ fieldError(errors[0]) }}</span>
        </v-col>
      </v-row>
    </ValidationProvider>
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
    options: {
      type: Object,
      default () { return {} }
    }
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
    messages () { return localeMessagesForUser(this.user, this.browserLocale) }
  },
  created () {
    this.days = Math.floor(this.options.fieldValue / DAYS_MILLIS)
    this.hours = Math.floor((this.options.fieldValue % DAYS_MILLIS) / HOURS_MILLIS)
    this.minutes = Math.floor((this.options.fieldValue % HOURS_MILLIS) / MINUTES_MILLIS)
  },
  methods: {
    fieldError (error) {
      return error ? fieldErrorMessage(this.options.fieldLabel, error, this.messages, '') : '(no message)'
    }
  }
}
</script>
