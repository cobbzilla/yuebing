<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>
          {{ messages.admin_title_migrate_data }}
        </h2>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar && dataMigrationResults">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            {{ messages.admin_info_migration_success }}
          </h4>
          <small>
            <vue-json-pretty
              :data="dataMigrationResults"
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
    <v-row v-if="showErrorSnackbar && dataMigrationError">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>{{ messages.admin_info_migration_error }}</h4>
          <div v-if="errorRawDisplay">
            <small>
              <vue-json-pretty
                :data="migrationError"
                :show-line="false"
                :show-double-quotes="false"
                :select-on-click-node="false"
                :highlight-selected-node="false"
                :collapsed-on-click-brackets="false"
              />
            </small>
          </div>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="dataMigrationResults">
          {{ messages.admin_label_migration_results }}
          <pre>{{ JSON.stringify(dataMigrationResults, null, 2) }}</pre>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="sourcesLoaded && !hasSources">
      <v-col>
        <h3>
          {{ messages.admin_label_migration_noSources }}
        </h3>
        <h4>
          <NuxtLink to="/admin/sources">
            {{ messages.admin_title_source_administration }}
          </NuxtLink>
        </h4>
      </v-col>
    </v-row>
    <v-row v-else-if="sourcesLoaded">
      <v-col>
        <ValidationObserver ref="form">
          <form v-if="filteredSourceList" id="form">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="readSource" rules="required" immediate>
                <v-select
                  v-model="readSource"
                  name="readSource"
                  :label="messages.admin_label_migration_readSource"
                  :items="filteredSourceList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                />
                <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('readSource', errors) }}</span>
              </ValidationProvider>
            </div>
            <div>
              <ValidationProvider v-slot="{ errors }" name="readPath" :rules="formRules.readPath" immediate>
                <v-text-field
                  v-model="readPath"
                  name="readPath"
                  :label="messages.admin_label_migration_readPath"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.length>0 }"
                />
                <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('readPath', errors) }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="writeSource" rules="required" immediate>
                <v-select
                  v-model="writeSource"
                  :label="messages.admin_label_migration_writeSource"
                  :items="filteredSourceList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                />
                <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('writeSource', errors) }}</span>
              </ValidationProvider>
            </div>
            <div>
              <ValidationProvider v-slot="{ errors }" name="name" :rules="formRules.writePath" immediate>
                <v-text-field
                  v-model="writePath"
                  name="writePath"
                  :label="messages.admin_label_migration_writePath"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.length>0 }"
                />
                <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('writePath', errors) }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <v-btn class="btn btn-primary" @click.stop="handleSubmit">
                {{ messages.admin_button_migrate_data }}
              </v-btn>
            </div>
          </form>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { publicConfigField, empty, SELF_SOURCE_NAME } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { condensedRules } from '@/shared/validation'
import { UI_CONFIG } from '@/services/util'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MigrateData',
  components: { VueJsonPretty },
  data () {
    return {
      sourcesLoaded: false,
      submitted: false,

      readSource: null,
      readPath: '',
      writeSource: null,
      writePath: '',

      showSuccessSnackbar: false,
      successSnackTimeout: -1,
      showErrorSnackbar: false,
      errorSnackTimeout: -1,
      errorRawDisplay: false
    }
  },
  computed: {
    ...mapState('admin', ['sourceList', 'dataMigrationResults', 'dataMigrationError']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    formRules () { return condensedRules() },
    selfName () { return this.messages.admin_label_self_source.parseMessage({ title: publicConfigField(this, 'title') }) },
    filteredSourceList () {
      return this.sourceList
        ? this.sourceList.map((s) => {
          return s.name && s.name === SELF_SOURCE_NAME
            ? Object.assign({}, s, { name: this.selfName })
            : s
        })
        : null
    },
    hasSources () { return this.sourceList && !empty(this.sourceList) },
    migrationError () {
      return this.dataMigrationError
        ? typeof this.dataMigrationError === 'object' || typeof this.dataMigrationError === 'string'
          ? this.dataMigrationError
          : `${this.dataMigrationError}`
        : null
    }
  },
  watch: {
    dataMigrationError (newError) {
      if (newError) {
        console.log(`received newError: ${newError}`)
        // longer timeout for these kinds of things, more time to see the error
        this.errorSnackTimeout = 2 * UI_CONFIG.snackbarErrorTimeout
        this.showErrorSnackbar = true
        this.showSuccessSnackbar = false
        if (Object.keys(newError).filter(k => ['readSource', 'readPath', 'writeSource', 'writePath'].includes(k)).length > 0) {
          this.$refs.form.setErrors(newError)
          this.errorRawDisplay = false
        } else {
          this.errorRawDisplay = true
        }
      } else {
        this.errorSnackTimeout = null
        this.showErrorSnackbar = false
      }
    },
    sourceList () { this.sourcesLoaded = true }
  },
  created () {
    this.findSources({ pageSize: 100 })
  },
  methods: {
    ...mapActions('admin', ['findSources', 'migrate']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages, 'admin_label_') : '(no message)'
    },
    adjustForSelf (source) {
      return source === this.selfName ? SELF_SOURCE_NAME : source
    },
    async handleSubmit () {
      this.submitted = true
      await this.$refs.form.validate().then((success) => {
        if (success) {
          const migration = {
            readSource: this.adjustForSelf(this.readSource),
            readPath: this.readPath,
            writeSource: this.adjustForSelf(this.writeSource),
            writePath: this.writePath
          }
          this.migrate({ migration })
        }
      })
    }
  }
}
</script>
