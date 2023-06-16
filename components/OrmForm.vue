<template>
  <v-container>
    <v-row>
      <v-col>
        <ValidationObserver :ref="formName">
          <v-form :id="formName" @submit.prevent="handleSave">
            <v-container>
              <v-row v-for="(field, fieldIndex) in fields" :key="fieldIndex">
                <v-col v-if="fieldVisible(field)">
                  <OrmField
                    :field="field"
                    :value="values[fieldIndex]"
                    :submitted="submitted"
                    :create="create"
                    @update="onFieldUpdate"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleSave">
                    {{ messages[saveButtonMessage] }}
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
import OrmField from '@/components/OrmField'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'OrmForm',
  components: { OrmField },
  props: {
    formName: { type: String, default: () => 'OrmForm' },
    thing: { type: Object, default: () => { return {} } },
    saveButtonMessage: { type: String, default: () => 'button_update' },
    fields: { type: Array, default: () => { return [] } },
    values: { type: Array, default: () => [] },
    create: { type: Boolean, default: () => false },
    submitted: { type: Boolean, default: () => false },
    serverErrors: { type: Object, default: () => { return {} } }
  },
  data () {
    return {
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
    }
  },
  created () {},
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
      this.$emit('update', update)
    },
    async handleSave () {
      try {
        await this.$refs[this.formName].validate().then((success) => {
          if (success) {
            console.log('handleSave: emitting submitted')
            this.$emit('submitted', true)
          } else {
            this.$emit('submitted', false)
            console.log(`handleSave: validation failed: ${success}`)
          }
        })
      } catch (e) {
        console.error(`handleSave failed: ${e}`)
      }
    }
  }
}
</script>
