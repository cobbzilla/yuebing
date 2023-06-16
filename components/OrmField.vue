<template>
  <v-container>
    <v-row>
      <v-col>
        <ValidationProvider v-slot="{ errors }" :name="field.name" :rules="fieldRules" immediate>
          <div v-if="field.control === 'text' || field.control === 'password'">
            <v-text-field
              v-model="localValue"
              :type="field.control"
              :label="messages['label_'+field.name]"
              :full-width="false"
              :name="field.name"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: field.name, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'label'">
            <v-text-field
              v-if="!create"
              v-model="localValue"
              :type="field.control"
              :label="messages['label_'+field.name]"
              :full-width="false"
              :name="field.name"
              class="form-control"
              :readonly="true"
            />
          </div>
          <div v-else-if="field.control === 'textarea'">
            <v-textarea
              v-model="localValue"
              :label="messages['label_'+field.name]"
              :full-width="true"
              :name="field.name"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: field.name, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'flag'">
            <v-checkbox
              v-model="localValue"
              :label="messages['label_'+field.name]"
              :full-width="true"
              :name="field.name"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: field.name, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'select'">
            <v-select
              v-model="localValue"
              :label="messages['label_'+field.name]"
              :items="fieldItems(field)"
              item-value="value"
              item-text="label"
              :full-width="false"
              :name="field.name"
              :value="value"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: field.name, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'multi'">
            <v-select
              v-model="localValue"
              :label="messages['label_'+field.name]"
              :items="fieldItems(field)"
              item-value="value"
              item-text="label"
              :full-width="false"
              :name="field.name"
              :value="value"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              :multiple="true"
              @change="$emit('update', { field: field.name, value: localValue })"
            />
          </div>
          <div v-else>
            <v-text-field
              v-model="localValue"
              :type="field.control"
              :label="messages['label_'+field.name]"
              :full-width="false"
              :name="field.name"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: field.name, value: localValue })"
            />
          </div>
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
    value: { type: [String, Number, Boolean, Object], default: null },
    submitted: { type: Boolean, default: () => false },
    create: { type: Boolean, default: () => false },
    labelPrefix: { type: String, default: () => 'label_' }
  },
  data () {
    return {
      localValue: this.value ? this.value : this.field.default ? this.field.default : null
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    fieldRules () {
      // transform fieldDef to vee-validate rules
      const rules = {}
      if (this.field.required) {
        rules.required = this.field.required
      }
      if (this.field.min) {
        rules.min = this.field.min
      }
      if (this.field.max) {
        rules.max = this.field.max
      }
      if (this.field.minValue) {
        rules.minValue = this.field.minValue
      }
      if (this.field.maxValue) {
        rules.maxValue = this.field.maxValue
      }
      if (this.field.regex) {
        rules.regex = this.field.regex
      }
      return rules
    }
  },
  created () {
  },
  methods: {
    fieldError (error) {
      return error ? fieldErrorMessage(this.field.name, error, this.messages, this.labelPrefix) : '(no message)'
    },
    fieldItems (field) {
      return field.items.map((item) => {
        return {
          value: item.value,
          label: this.messages[item.label]
        }
      })
    }
  }
}
</script>
