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
    <v-row v-if="volumesLoaded && !hasVolumes">
      <v-col>
        <h3>
          {{ messages.admin_label_migration_noVolumes }}
        </h3>
        <h4>
          <NuxtLink to="/admin/volumes">
            {{ messages.admin_title_volume_administration }}
          </NuxtLink>
        </h4>
      </v-col>
    </v-row>
    <v-row v-else-if="volumesLoaded">
      <v-col>
        <ValidationObserver ref="form">
          <v-form v-if="filteredVolumeList" id="form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="readVolume" rules="required" immediate>
                <v-select
                  v-model="readVolume"
                  name="readVolume"
                  :label="messages.admin_label_migration_readVolume"
                  :items="filteredVolumeList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('readVolume', errors) : null"
                />
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
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('readPath', errors) : null"
                />
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="writeVolume" rules="required" immediate>
                <v-select
                  v-model="writeVolume"
                  :label="messages.admin_label_migration_writeVolume"
                  :items="filteredVolumeList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('writeVolume', errors) : null"
                />
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
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('writePath', errors) : null"
                />
              </ValidationProvider>
            </div>
            <div class="form-group">
              <v-btn class="btn btn-primary" @click.stop="handleSubmit">
                {{ messages.admin_button_migrate_data }}
              </v-btn>
            </div>
          </v-form>
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
import { publicConfigField, empty, SELF_VOLUME_NAME, isSelfVolume } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { condensedRules } from '@/shared/type/validation'
import { UI_CONFIG } from '@/services/util'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'MigrateData',
  components: { VueJsonPretty },
  data () {
    return {
      volumesLoaded: false,
      submitted: false,

      readVolume: null,
      readPath: '',
      writeVolume: null,
      writePath: '',

      showSuccessSnackbar: false,
      successSnackTimeout: -1,
      showErrorSnackbar: false,
      errorSnackTimeout: -1,
      errorRawDisplay: false
    }
  },
  computed: {
    ...mapState('admin', ['volumeList', 'dataMigrationResults', 'dataMigrationError']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    formRules () { return condensedRules() },
    selfName () { return this.messages.admin_label_self_volume.parseMessage({ title: publicConfigField(this, 'title') }) },
    filteredVolumeList () {
      return this.volumeList
        ? this.volumeList.map((vol) => {
          return vol.name && isSelfVolume(vol.name)
            ? Object.assign({}, vol, { name: this.selfName, self: true })
            : vol
        })
        : null
    },
    hasVolumes () { return this.volumeList && !empty(this.volumeList) },
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
        // longer timeout for these kinds of things, more time to see the error
        this.errorSnackTimeout = 2 * UI_CONFIG.snackbarErrorTimeout
        this.showErrorSnackbar = true
        this.showSuccessSnackbar = false
        if (Object.keys(newError).filter(k => ['readVolume', 'readPath', 'writeVolume', 'writePath'].includes(k)).length > 0) {
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
    volumeList () { this.volumesLoaded = true }
  },
  created () {
    this.findVolumes({ pageSize: 100 })
  },
  methods: {
    ...mapActions('admin', ['findVolumes', 'migrate']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages, 'admin_label_') : '(no message)'
    },
    adjustForSelf (volume) {
      return isSelfVolume(volume) ? SELF_VOLUME_NAME : volume
    },
    async handleSubmit () {
      this.submitted = true
      await this.$refs.form.validate().then((success) => {
        if (success) {
          const migration = {
            readVolume: this.adjustForSelf(this.readVolume),
            readPath: this.readPath,
            writeVolume: this.adjustForSelf(this.writeVolume),
            writePath: this.writePath
          }
          this.migrate({ migration })
        }
      })
    }
  }
}
</script>
