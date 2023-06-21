<template>
  <v-container>
    <v-row v-if="showSuccessSnackbar && isSuccess(addObjectSuccess)">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            snackbar: {{
              messages[addObjectSuccessMessage].parseMessage({
                id: addObjectSuccess[typeDef.idField(addObjectSuccess)],
                type: messages[typeNameMessage]
              })
            }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && isError(addObjectError)">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{
              messages[addObjectErrorMessage].parseMessage({
                type: messages[typeNameMessage],
                error: `${addObjectError ?? 'undefined'}`
              })
            }}
          </h4>
          <small>
            <vue-json-pretty
              :data="addObjectError"
              :show-line="false"
              :show-double-quotes="false"
              :select-on-click-node="false"
              :highlight-selected-node="false"
              :collapsed-on-click-brackets="false"
            />
          </small>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4>{{ messages[addObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <OrmForm
          :form-name="addFormName"
          :type-def="typeDef"
          :type-name-message="typeNameMessage"
          :thing="addObjectObject"
          save-button-message="admin_button_add"
          :fields="objectFields"
          :create="true"
          :submitted="objectSubmitted"
          :success-event="addObjectSuccess"
          :server-errors="addObjectError"
          :label-prefixes="labelPrefixes"
          @update="onAddOrmUpdate"
          @submitted="onAddOrmSubmit"
          @cancel="onCancelOrmForm"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import OrmForm from '@/components/orm/OrmForm'
import { publicConfigField } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'
import { UI_CONFIG } from '@/services/util'

export default {
  name: 'OrmAdd',
  components: { VueJsonPretty, OrmForm },
  props: {
    typeDef: { type: Object, required: true },
    typeNameMessage: { type: String, required: true },
    labelPrefixes: { type: Array, default: () => ['label_'] },

    addObjectObject: { type: Object, required: true },
    objectSubmitted: { type: Boolean, default: () => false },
    addObjectMessage: { type: String, default: () => 'admin_button_add' },
    addObjectSuccess: { type: Object, required: true },
    addObjectError: { type: Object, required: true },
    addObjectSuccessMessage: { type: String, default: () => 'admin_info_added' },
    addObjectErrorMessage: { type: String, default: () => 'admin_info_add_error' }
  },
  data () {
    return {
      showSuccessSnackbar: false,
      successSnackTimeout: -1,
      showErrorSnackbar: false,
      errorSnackTimeout: -1
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') },
    addFormName () { return `add${this.typeDef.typeName}Form` },
    objectFields () { return this.typeDef.tabIndexedFields() }
  },
  watch: {
    addObjectError (newError) {
      if (newError) {
        if (newError.errors) {
          this.errorSnackTimeout = null
          this.showErrorSnackbar = false
        } else {
          // longer timeout for these kinds of things, more time to see the error
          this.errorSnackTimeout = 2 * UI_CONFIG.snackbarErrorTimeout
          this.showErrorSnackbar = true
          this.showSuccessSnackbar = false
        }
      } else {
        this.errorSnackTimeout = null
        this.showErrorSnackbar = false
      }
    },
    addObjectSuccess (ok) {
      if (ok) {
        // longer timeout for these kinds of things, more time to see the message
        console.log(`OrmAdd.addObjectSuccess received: ${JSON.stringify(ok)}`)
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
        this.showErrorSnackbar = false
      } else {
        this.showSuccessSnackbar = false
        this.successSnackTimeout = null
      }
    }
  },
  methods: {
    ...mapActions(['loadPublicConfig']),
    isValidSuccessOrError (obj) { return obj && typeof (obj) === 'object' && Object.keys(obj).length > 0 },
    isSuccess (obj) { this.isValidSuccessOrError(obj) },
    isError (obj) { this.isValidSuccessOrError(obj) },

    onAddOrmUpdate (update) {
      if (update) {
        console.log(`OrmAdd.onAddOrmUpdate emitting newObjectUpdate: ${JSON.stringify(update)}`)
        this.$emit('newObjectUpdate', update)
      }
    },
    onAddOrmSubmit (submitted) {
      if (submitted) {
        console.log(`OrmAdd.onAddOrmSubmit emitting newObjectSubmit: ${JSON.stringify(submitted)}`)
        this.$emit('newObjectSubmit', submitted)
      }
    },
    onCancelOrmForm (cancel) {
      if (cancel) {
        console.log(`OrmAdd.onCancelOrmForm emitting newObjectCancel: ${JSON.stringify(cancel)}`)
        this.newObject = Object.assign({}, this.typeDef.newFullInstance(), this.addObjectObject)
        this.$emit('newObjectCancel', cancel)
      }
    }
  }
}
</script>
