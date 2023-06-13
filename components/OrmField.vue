<template>
  <v-container>
    <v-row>
      <v-col>
        <ValidationProvider v-slot="{ errors }" :name="field.name" :rules="fieldRules" immediate>
          <v-text-field
            v-model="value"
            :label="messages['label_'+field.name]"
            :full-width="false"
            :name="field.name"
            class="form-control"
            :error="submitted && errors.length>0"
            :error-messages="submitted ? fieldError(field.name, errors) : null"
            @change="$emit('update', {field: field.name, value })"
          />
        </ValidationProvider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'OrmField',
  props: {
    field: { type: Object, default: () => { return {} } },
    submitted: { type: Boolean, default: () => false }
  },
  data () {
    return { value: null }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    fieldRules () {
      // transform fieldDef to vee-validate rules
      let rules = ''
      if (this.field.required) {
        rules += 'required|'
      }
      if (this.field.max) {
        rules += `max:${this.field.max}|`
      }
      if (this.field.min) {
        rules += `min:${this.field.min}|`
      }
      if (this.field.minValue) {
        rules += `minValue:${this.field.minValue}|`
      }
      if (this.field.maxValue) {
        rules += `maxValue:${this.field.maxValue}|`
      }
      if (this.field.regexName) {
        rules += `${this.field.regexName}|`
      }
      // todo: check for regex validator that matches field name
      return rules.substring(0, rules.length - 1)
    }
  },
  created () {
  },
  methods: {
    fieldError (error) {
      return error ? fieldErrorMessage(this.field.name, error, this.messages, '') : '(no message)'
    }
  }
}
</script>
