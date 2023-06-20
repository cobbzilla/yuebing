<template>
  <v-container>
    <v-row v-if="fieldHeader !== ''">
      <v-col>
        <h4>{{ messages[fieldHeader] }}</h4>
      </v-col>
    </v-row>
    <v-row v-for="(field, fieldIndex) in fields" :key="fieldIndex">
      <v-col v-if="fieldVisible(field)">
        <div v-if="isObject(field)">
          <OrmFormFields
            :fields="tabIndexed(field)"
            :root-thing="rootThing"
            :thing="thing[field.name]"
            :obj-path="nextPath(field.name)"
            :field-header="''"
            :success-event="successEvent"
            :server-errors="serverErrors"
            :label-prefixes="labelPrefixes"
            :submitted="submitted"
            :saving="saving"
            :create="create"
            :form-level="formLevel + 1"
            @update="onFieldUpdate"
          />
        </div>
        <div v-else>
          <OrmField
            :field="field"
            :root-thing="thing"
            :thing="thing"
            :obj-path="nextPath(field.name)"
            :value="valueOrDefault(thing, field)"
            :label-prefixes="labelPrefixes"
            :submitted="submitted"
            :saving="saving"
            :create="create"
            :success-event="successEvent"
            @update="onFieldUpdate"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import OrmField from '@/components/orm/OrmField'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'OrmFormFields',
  components: { OrmField },
  props: {
    fieldHeader: { type: String, default: () => '' },
    rootThing: { type: Object, default: () => { return {} } },
    thing: { type: Object, default: () => { return {} } },
    objPath: { type: String, default: () => '' },
    fields: { type: Array, default: () => { return [] } },
    create: { type: Boolean, default: () => false },
    submitted: { type: Boolean, default: () => false },
    saving: { type: Boolean, default: () => false },
    successEvent: { type: Object, required: true },
    serverErrors: { type: Object, default: () => { return {} } },
    labelPrefixes: { type: Array, default: () => ['label_'] },
    formLevel: { type: Number, default: () => 0 }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) }
  },
  methods: {
    valueOrDefault (thing, field) {
      if (typeof (thing[field.name]) !== 'undefined') {
        return thing[field.name]
      }
      if (typeof (this.thing[field.name]) !== 'undefined') {
        return this.thing[field.name]
      }
      if (field.default) {
        return field.default
      }
      return null
    },
    nextPath (field) {
      if (this.objPath === '') {
        return field
      }
      return this.objPath + '.' + field
    },
    tabIndexed (field) {
      return Array.isArray(field.tabIndexes)
        ? field.tabIndexes.map((t) => {
          return { name: t, ...field.fields[t] }
        })
        : Object.keys(field.fields).map((f) => {
          return { name: f, ...field.fields[f] }
        })
    },
    fieldError (error) {
      return error ? fieldErrorMessage(this.field.name, error, this.messages, '') : '(no message)'
    },
    fieldVisible (field) {
      if (field.control && ['hidden', 'system'].includes(field.control)) {
        return false
      }
      if (typeof (field.when) === 'function') {
        try {
          if (!field.when(this.rootThing)) {
            return false
          }
        } catch (e) {
          return false
        }
      }
      return this.create || typeof (field.editable) === 'undefined' || field.editable === true
    },
    isObject (field) {
      const isObj = field.type === 'object' && field.fields && Object.keys(field.fields).length > 0
      if (isObj) {
        if (!this.thing[field.name] || typeof (this.thing[field.name]) !== 'object') {
          this.$emit('update', { field: this.nextPath(field.name), value: {} })
        }
      }
      return isObj
    },
    onFieldUpdate (update) {
      console.log(`OrmFormField.onFieldUpdate: emitting ${JSON.stringify(update)}`)
      this.$emit('update', update)
    }
  }
}
</script>
