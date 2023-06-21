<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages[typeAdminMessage] }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="addingObject">
      <v-col>
        <OrmAdd
          :type-def="typeDef"
          :type-name-message="typeNameMessage"
          :label-prefixes="labelPrefixes"
          :add-object-object="addObjectObject"
          :object-submitted="objectSubmitted"
          :add-object-message="addObjectMessage"
          :add-object-success="addObjectSuccess"
          :add-object-error="addObjectError"
          :add-object-error-message="addObjectErrorMessage"
          :add-object-success-message="addObjectSuccessMessage"
          @newObjectUpdate="onNewObjectUpdate"
          @newObjectSubmit="onNewObjectSubmit"
          @newObjectCancel="onNewObjectCancel"
        />
      </v-col>
    </v-row>
    <v-row v-else-if="editingObject">
      <OrmEdit
        :type-def="typeDef"
        :type-name-message="typeNameMessage"
        :label-prefixes="labelPrefixes"
        :target-object="editingObject"
        :read-only-object="readOnlyObject"
        :object-submitted="objectSubmitted"
        :edit-object-message="editObjectMessage"
        :edit-object-success="editObjectSuccess"
        :edit-object-error="editObjectError"
        :edit-object-error-message="editObjectErrorMessage"
        :edit-object-success-message="editObjectSuccessMessage"
        @editObjectSubmit="onEditObjectSubmit"
        @editObjectCancel="onEditObjectCancel"
      />
    </v-row>
    <v-row v-else>
      <v-col>
        <v-container>
          <v-row v-if="totalObjectCount > 0">
            <v-col>
              <div>
                <ValidationObserver ref="form">
                  <v-form @submit.prevent="searchObjects">
                    <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                      <div class="form-group">
                        <v-text-field
                          v-model="searchTerms"
                          :label="messages.label_search"
                          type="text"
                          name="searchTerms"
                          class="form-control"
                          :error="errors.length>0"
                          :error-messages="fieldError('searchTerms', errors)"
                          @keyup.enter="searchObjects"
                        />
                        <v-btn class="btn btn-primary" :disabled="findingObjects" @click.stop="searchObjects">
                          {{ messages.button_search }}
                        </v-btn>
                      </div>
                    </ValidationProvider>
                  </v-form>
                </ValidationObserver>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <table v-if="objectList && objectList.length > 0">
                <thead>
                <tr>
                  <th v-for="(tableField, tableFieldIndex) in tableFields" :key="tableFieldIndex">
                    {{ tableFieldMessages[tableField] }}
                  </th>
                  <th>
                    {{ messages.admin_label_actions }}
                  </th>
                  <th>{{ messages[editObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}</th>
                  <th>{{ messages[deleteObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(obj, objIndex) in objectList" :key="objIndex">
                  <td v-for="(fieldName, fieldIndex) in tableFields" :key="fieldIndex">
                    <OrmFieldDisplay :field="typeDef.fields[fieldName]" :value="obj[fieldName]" />
                  </td>
                  <td>
                    <div v-for="(action, actionIndex) in Object.keys(actionConfigs)" :key="actionIndex">
                      <NuxtLink
                        v-if="actionEnabled(obj, action)"
                        :to="{ path: `${actionConfig(action).path}/${obj[typeDef.idField(obj)]}` }"
                      >
                        <v-btn>
                          {{ messages[actionConfig(action).message] }}
                        </v-btn>
                      </NuxtLink>
                    </div>
                  </td>
                  <td>
                    <v-btn v-if="canEdit(obj)" :disabled="objectOperationInProgress" @click.stop="showEditOrm(obj)">
                      {{ messages[readOnlyObject(obj) ? viewObjectMessage : editObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}
                    </v-btn>
                  </td>
                  <td>
                    <v-btn v-if="canDelete(obj)" :disabled="objectOperationInProgress" @click.stop="delObject(obj)">
                      {{ messages[deleteObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn class="btn btn-primary" :disabled="findingObjects" @click.stop="showAddOrm">
                {{ messages[addObjectMessage].parseMessage({ type: messages[typeNameMessage] }) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'vue-json-pretty/lib/styles.css'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import OrmAdd from '@/components/orm/OrmAdd'
import OrmEdit from '@/components/orm/OrmEdit'
import OrmFieldDisplay from '@/components/orm/OrmFieldDisplay'
import { publicConfigField } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser, findMessage } from '@/shared/locale'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 3

export default {
  name: 'OrmAdmin',
  components: { OrmAdd, OrmEdit, OrmFieldDisplay },
  props: {
    typeDef: { type: Object, required: true },
    typeNameMessage: { type: String, required: true },
    typeAdminMessage: { type: String, required: true },
    labelPrefixes: { type: Array, default: () => ['label_'] },
    objectList: { type: Array, default: () => [] },
    actionConfigs: { type: Object, default: () => { return {} } },
    totalObjectCount: { type: Number, default: () => 0 },

    addObjectObject: { type: Object, required: true },
    addObjectMessage: { type: String, default: () => 'admin_button_add' },
    addObjectSuccess: { type: Object, required: true },
    addObjectError: { type: [Object, String], required: true },
    addObjectSuccessMessage: { type: String, default: () => 'admin_info_added' },
    addObjectErrorMessage: { type: String, default: () => 'admin_info_add_error' },

    readOnlyObject: { type: Function, default: () => () => false },
    viewObjectMessage: { type: String, default: () => 'admin_button_view' },
    editObjectMessage: { type: String, default: () => 'admin_button_edit' },
    editObjectSuccess: { type: Object, required: true },
    editObjectError: { type: [Object, String], required: true },
    editObjectSuccessMessage: { type: String, default: () => 'admin_info_edited' },
    editObjectErrorMessage: { type: String, default: () => 'admin_info_edit_error' },

    canEdit: { type: Function, default: () => false },
    canDelete: { type: Function, default: () => false },
    deleteObjectMessage: { type: String, default: () => 'admin_button_delete' },
    deleteObjectSuccess: { type: Object, required: true },
    deleteObjectError: { type: [Object, String], required: true },
    deleteConfirmationMessage: { type: String, required: true },

    objectSubmitted: { type: Boolean, default: () => false },
    objectOperationInProgress: { type: Boolean, required: true }
  },
  data () {
    return {
      pageNumber: 1,
      pageSize: 20,
      searchTerms: '',
      lastQuery: null,
      deleteConfirmCount: 0,
      addingObject: false,
      findingObjects: false,
      editingObject: null
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') },
    addFormName () { return `add${this.typeDef.typeName}Form` },
    objectFields () { return this.typeDef.tabIndexedFields() },
    searchQuery () {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerms: this.searchTerms
      }
    },
    tableFields () {
      return this.typeDef.tableFields && Array.isArray(this.typeDef.tableFields)
        ? this.typeDef.tableFields
        : this.typeDef.primary
          ? [this.typeDef.primary, 'ctime', 'mtime']
          : ['id', 'ctime', 'mtime']
    },
    tableFieldMessages () {
      const defaultTableFieldMessages = {}
      this.tableFields.forEach((f) => {
        defaultTableFieldMessages[f] = findMessage(f, this.messages, this.labelPrefixes)
      })
      return defaultTableFieldMessages
    }
  },
  watch: {
    objectList (newList) {
      if (newList && Array.isArray(newList)) {
        this.findingObjects = false
      }
    },
    addObjectSuccess (success) {
      if (success && typeof (success) === 'object' && Object.keys(success).length > 0) {
        this.addingObject = false
        this.searchObjects()
      }
    },
    editObjectSuccess (success) {
      if (success && typeof (success) === 'object' && Object.keys(success).length > 0) {
        this.editingObject = null
        this.searchObjects()
      }
    }
  },
  created () {
    if (!this.objectList || !Array.isArray(this.objectList) || this.objectList.length === 0) {
      this.searchObjects()
    }
  },
  methods: {
    ...mapActions(['loadPublicConfig']),
    isValidSuccessOrError (obj) { return obj && typeof (obj) === 'object' && Object.keys(obj).length > 0 },
    isSuccess (obj) { this.isValidSuccessOrError(obj) },
    isError (obj) { this.isValidSuccessOrError(obj) },
    fieldError (field, error, labelPrefix = 'label_') {
      return field && error ? fieldErrorMessage(field, error, this.messages, labelPrefix) : '(no message)'
    },
    searchObjects () {
      if (this.lastQuery && JSON.stringify(this.lastQuery) === JSON.stringify(this.searchQuery)) {
        console.log('not sending duplicate search')
      } else {
        const query = this.searchQuery
        this.lastQuery = Object.assign({}, query)
        console.log(`searchObjects: emitting query: ${JSON.stringify(query)}`)
        this.findingObjects = true
        this.$emit('query', query)
      }
    },
    actionConfig (action) { return this.actionConfigs[action] },
    actionEnabled (obj, action) {
      const cfg = this.actionConfigs[action]
      if (!cfg.when || typeof (cfg.when) !== 'function') {
        return true
      }
      if (typeof (cfg.when) === 'function') {
        return cfg.when(obj) === true
      }
      return true
    },

    onNewObjectUpdate (update) { this.$emit('newObjectUpdate', update) },
    onNewObjectSubmit (update) { this.$emit('newObjectSubmit', update) },
    showAddOrm () { this.addingObject = true },
    onNewObjectCancel (update) { this.addingObject = false },

    onEditObjectSubmit (update) { this.$emit('editObjectSubmit', update) },
    showEditOrm (obj) {
      if (this.editingObject) {
        // already editing something else
        return
      }
      if (obj) {
        const id = this.typeDef.id(obj)
        if (id && id.length > 0) {
          this.editingObject = structuredClone(obj)
          this.$emit('editObjectStart', this.editingObject)
        }
      }
    },
    onEditObjectCancel (update) { this.editingObject = null },

    delObject (obj) {
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages[this.deleteConfirmationMessage].parseMessage({ id: obj ? obj[this.typeDef.idField(obj)] : null }))) {
        this.deleteConfirmCount++
        this.$emit('deleteObject', obj)
      } else {
        this.deleteConfirmCount = 0
      }
    }
  }
}
</script>
