<template>
  <v-container>
    <v-row v-if="showSuccessSnackbar && isSuccess(editObjectSuccess)">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            snackbar: {{
              messages[editObjectSuccessMessage].parseMessage({
                id: editObjectSuccess[typeDef.idField(editObjectSuccess)],
                type: messages[typeNameMessage]
              })
            }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && isError(editObjectError)">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{
              messages[editObjectErrorMessage].parseMessage({
                type: messages[typeNameMessage],
                error: `${editObjectError ?? 'undefined'}`
              })
            }}
          </h4>
          <small>
            <vue-json-pretty
              :data="editObjectError"
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
        <h4>{{ messages[editObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <OrmForm
          :form-name="editFormName"
          :type-def="typeDef"
          :type-name-message="typeNameMessage"
          :thing="localObject"
          :read-only-object="readOnlyObject"
          save-button-message="admin_button_edit"
          :fields="objectFields"
          :create="false"
          :submitted="objectSubmitted"
          :success-event="editObjectSuccess"
          :server-errors="editObjectError"
          :label-prefixes="labelPrefixes"
          @update="onEditOrmUpdate"
          @submitted="onEditOrmSubmit"
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
import { deepUpdate, publicConfigField } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'
import { UI_CONFIG } from '@/services/util'

export default {
  name: 'OrmEdit',
  components: { VueJsonPretty, OrmForm },
  props: {
    typeDef: { type: Object, required: true },
    typeNameMessage: { type: String, required: true },
    labelPrefixes: { type: Array, default: () => ['label_'] },

    targetObject: { type: Object, required: true },
    readOnlyObject: { type: Function, default: () => () => false },
    objectSubmitted: { type: Boolean, default: () => false },
    editObjectMessage: { type: String, default: () => 'admin_button_edit' },
    editObjectSuccess: { type: Object, required: true },
    editObjectError: { type: [Object, String], required: true },
    editObjectSuccessMessage: { type: String, default: () => 'admin_info_edited' },
    editObjectErrorMessage: { type: String, default: () => 'admin_info_edit_error' }
  },
  data () {
    return {
      showSuccessSnackbar: false,
      successSnackTimeout: -1,
      showErrorSnackbar: false,
      errorSnackTimeout: -1,
      localObject: null
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') },
    editFormName () { return `edit${this.typeDef.typeName}Form` },
    objectFields () { return this.typeDef.tabIndexedFields() }
  },
  created () {
    this.localObject = structuredClone(this.targetObject)
  },
  watch: {
    editObjectError (newError) {
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
    editObjectSuccess (ok) {
      if (ok) {
        // longer timeout for these kinds of things, more time to see the message
        console.log(`OrmEdit.editObjectSuccess received: ${JSON.stringify(ok)}`)
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

    onEditOrmUpdate (update) {
      if (update) {
        console.log(`OrmEdit.onEditOrmUpdate deep updating: ${JSON.stringify(update)}`)
        deepUpdate(this.localObject, update.field, update.value)
      }
    },
    onEditOrmSubmit (submitted) {
      if (submitted) {
        console.log(`OrmEdit.onEditOrmSubmit emitting editObjectSubmit: submitted=${JSON.stringify(submitted)}, emitting=this.localObject=${JSON.stringify(this.localObject)}`)
        this.$emit('editObjectSubmit', this.localObject)
      }
    },
    onCancelOrmForm (cancel) {
      if (cancel) {
        console.log(`OrmEdit.onCancelOrmForm emitting editObjectCancel: ${JSON.stringify(cancel)}`)
        this.localObject = null
        this.$emit('editObjectCancel', cancel)
      }
    }
  }
}
</script>
