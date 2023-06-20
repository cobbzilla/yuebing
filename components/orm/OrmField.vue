<template>
  <v-container>
    <v-row>
      <v-col>
        <ValidationProvider v-slot="{ errors }" :name="field.name" :rules="fieldRules" immediate>
          <div v-if="field.control === 'text' || field.control === 'password'">
            <v-text-field
              v-model="localValue"
              :type="field.control"
              :label="labelFor(field)"
              :full-width="false"
              :name="field.name"
              :value="value ? value : field.default ? field.default : null"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: objPath, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'label'">
            <v-text-field
              v-if="!create"
              v-model="localValue"
              :type="'text'"
              :label="labelFor(field)"
              :full-width="false"
              :name="field.name"
              class="form-control"
              :readonly="true"
            />
          </div>
          <div v-else-if="field.control === 'textarea'">
            <v-textarea
              v-model="localValue"
              :label="labelFor(field)"
              :full-width="true"
              :name="field.name"
              :value="value ? value : field.default ? field.default : null"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: objPath, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'flag'">
            <v-checkbox
              v-model="localValue"
              :label="labelFor(field)"
              :full-width="true"
              :name="field.name"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: objPath, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'select'">
            <v-select
              v-model="localValue"
              :label="labelFor(field)"
              :items="fieldItems(field)"
              item-value="value"
              item-text="label"
              :full-width="false"
              :name="field.name"
              :value="valueOrDefault"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: objPath, value: localValue })"
            />
          </div>
          <div v-else-if="field.control === 'multi'">
            <v-select
              v-model="localValue"
              :label="labelFor(field)"
              :items="fieldItems(field)"
              item-value="value"
              item-text="label"
              :full-width="false"
              :name="field.name"
              :value="valueOrDefault"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              :multiple="true"
              @change="$emit('update', { field: objPath, value: localValue })"
            />
          </div>
          <div v-else>
            <v-text-field
              v-model="localValue"
              :type="field.control"
              :label="labelFor(field)"
              :full-width="false"
              :name="field.name"
              :value="valueOrDefault"
              class="form-control"
              :error="submitted && errors.length>0"
              :error-messages="submitted ? fieldError(errors) : null"
              @change="$emit('update', { field: objPath, value: localValue })"
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
import { fieldErrorMessage, localeMessagesForUser, findMessage } from '@/shared/locale'

export default {
  name: 'OrmField',
  props: {
    field: { type: Object, required: true },
    rootThing: { type: Object, required: true },
    thing: { type: Object, required: true },
    objPath: { type: String, required: true },
    value: { type: [String, Number, Boolean, Object, Array], default: () => null },
    submitted: { type: Boolean, default: () => false },
    saving: { type: Boolean, default: () => false },
    create: { type: Boolean, default: () => false },
    successEvent: { type: Object, required: true },
    labelPrefixes: { type: Array, default: () => ['label_'] }
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
    },
    valueOrDefault () {
      if (typeof (this.value) !== 'undefined' && this.value != null) {
        return this.value
      }
      if (typeof (this.thing[this.field.name]) !== 'undefined') {
        return this.thing[this.field.name]
      }
      if (this.field.default) {
        return this.field.default
      }
      return null
    }
  },
  watch: {
    successEvent (newEvent) {
      if (newEvent && typeof (newEvent) === 'object' && Object.keys(newEvent).length > 0) {
        this.localValue = this.valueOrDefault
      }
    }
  },
  created () {
  },
  methods: {
    fieldError (error) {
      return error ? fieldErrorMessage(this.field, error, this.messages, this.labelPrefixes) : '(no message)'
    },
    fieldItems (field) {
      return field.items.map((item) => {
        return {
          value: item.value,
          label: typeof (item.rawLabel) === 'boolean' && item.rawLabel === true
            ? item.label
            : this.messages[item.label]
        }
      })
    },
    labelFor (field) {
      if (field.label && typeof (field.label) === 'string' && field.label.length > 0) {
        return findMessage(field.label, this.messages, ['', ...this.labelPrefixes])
      }
      const fieldName = field.name
      return findMessage(fieldName, this.messages, this.labelPrefixes)
    }
  }
}
</script>
