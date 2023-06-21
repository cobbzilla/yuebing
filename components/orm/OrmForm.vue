<template>
  <v-container>
    <v-row>
      <v-col>
        <ValidationObserver :ref="formName">
          <v-form :id="formName" @submit.prevent="handleSave">
            <v-container>
              <OrmFormFields
                :fields="fields"
                :thing="newThing"
                :read-only-object="readOnlyObject"
                :root-thing="newThing"
                :obj-path="''"
                :field-header="''"
                :server-errors="serverErrors"
                :success-event="successEvent"
                :label-prefixes="labelPrefixes"
                :submitted="submitted"
                :saving="saving"
                :create="create"
                @update="onFieldUpdate"
              />
              <v-row>
                <v-col>
                  <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleSave">
                    {{ messages[saveButtonMessage].parseMessage({ type: messages[typeNameMessage] }) }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleCancel">
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import OrmFormFields from '@/components/orm/OrmFormFields'
import { deepUpdate } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'OrmForm',
  components: { OrmFormFields },
  props: {
    typeDef: { type: Object, required: true },
    typeNameMessage: { type: String, required: true },
    formName: { type: String, default: () => 'OrmForm' },
    thing: { type: Object, default: () => { return {} } },
    readOnlyObject: { type: Function, default: () => () => false },
    saveButtonMessage: { type: String, default: () => 'button_update' },
    fields: { type: Array, default: () => { return [] } },
    create: { type: Boolean, default: () => false },
    successEvent: { type: Object, required: true },
    serverErrors: { type: [Object, String], default: () => { return {} } },
    labelPrefixes: { type: Array, default: () => ['label_'] }
  },
  data () {
    return {
      submitted: false,
      newThing: null,
      saving: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) }
  },
  watch: {
    serverErrors (newError) {
      if (newError && newError.errors && Object.keys(newError.errors).length > 0) {
        this.$refs[this.formName].setErrors(newError.errors)
      }
    },
    successEvent (newEvent) {
      if (newEvent && typeof (newEvent) === 'object' && Object.keys(newEvent).length > 0) {
        Object.assign(this.newThing, JSON.parse(JSON.stringify(this.thing)))
        this.submitted = false
      }
    }
  },
  created () {
    this.newThing = JSON.parse(JSON.stringify(this.thing))
  },
  methods: {
    fieldError (error) {
      return error ? fieldErrorMessage(this.field.name, error, this.messages, '') : '(no message)'
    },
    fieldVisible (field) {
      if (field.control && ['hidden', 'system'].includes(field.control)) {
        return false
      }
      return this.create || typeof (field.editable) === 'undefined' || field.editable === true
    },
    onFieldUpdate (update) {
      console.log(`OrmForm.onFieldUpdate: emitting ${JSON.stringify(update)}`)
      if (update) {
        deepUpdate(this.newThing, update.field, update.value)
        this.$emit('update', update)
      }
    },
    async handleSave () {
      try {
        this.submitted = true
        this.saving = true
        await this.$refs[this.formName].validate().then((success) => {
          if (success) {
            console.log('handleSave: emitting submitted')
            this.$emit('submitted', this.newThing)
          } else {
            console.log(`handleSave: validation failed: ${success}`)
          }
        }).finally(() => {
          this.saving = false
        })
      } catch (e) {
        console.error(`handleSave failed: ${e}`)
      }
    },
    handleCancel () {
      this.$emit('cancel', true)
    }
  }
}
</script>
