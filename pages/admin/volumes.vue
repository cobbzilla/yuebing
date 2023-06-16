<template>
  <v-container>
    <v-overlay
      v-if="scanConfigOverlayObject"
      :opacity="0.9"
      :absolute="true"
      :value="scanConfigOverlayObject"
    >
      <v-container id="scanConfigOverlayContainer">
        <v-row>
          <v-col>
            <v-btn icon @click="setScanConfigOverlay(null)">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>
              {{ messages.admin_label_scan_config.parseMessage({ volume: scanConfigOverlayObject.name }) }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="scanConfig.ignoreErrors" :label="messages.label_scan_ignoreErrors" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="scanConfig.overwrite" :label="messages.label_scan_overwrite" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-model="scanConfig.reprocess"
              :label="messages.label_scan_reprocess"
              :name="allProfiles"
              :items="allProfiles"
              item-value="profile"
              item-text="mediaTypeAndProfile"
              :hint="messages.label_scan_reprocess_profiles"
              persistent-hint
              multiple
            >
              <template v-if="allProfiles.length > 1" v-slot:prepend-item>
                <v-list-item
                  ripple
                  @mousedown.prevent
                  @click="toggleAllProfiles"
                >
                  <v-list-item-action>
                    <v-icon :color="scanConfig.reprocess.length > 0 ? 'indigo darken-4' : ''">
                      {{ scanConfigSelectionIcon }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ messages.label_select_all }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="scanConfig.path"
              :label="messages.label_path"
              type="text"
              name="path"
              class="form-control"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="scanConfigOlderThan.enabled" :label="messages.admin_label_scan_olderThan" />
          </v-col>
        </v-row>
        <v-row v-if="scanConfigOlderThan.enabled">
          <v-col>
            <v-date-picker
              v-model="scanConfigOlderThan.date"
              :locale="user.locale"
              :value="scanConfigOlderThan.date"
            />
          </v-col>
          <v-col>
            <v-time-picker
              v-model="scanConfigOlderThan.time"
              :value="scanConfigOlderThan.time"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click.stop="scanSrc(scanConfigOverlayObject)">
              {{ messages.admin_button_scan_volume }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>

    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_volume_administration }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar && addVolumeSuccess">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            {{ messages.admin_info_volume_added.parseMessage({ volume: newVolume.name }) }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && addVolumeError">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{ messages.admin_info_volume_add_error.parseMessage({ volume: newVolume.name }) }}
          </h4>
          <small>
            <vue-json-pretty
              :data="addVolumeError"
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
    <v-row v-if="totalVolumeCount > 0">
      <v-col>
        <div>
          <ValidationObserver ref="form">
            <v-form @submit.prevent="searchVolumes">
              <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                <div class="form-group">
                  <v-text-field
                    v-model="searchTerms"
                    :label="messages.label_search"
                    type="text"
                    name="searchTerms"
                    class="form-control"
                    :error="addVolumeSubmitted && errors.length>0"
                    :error-messages="addVolumeSubmitted ? fieldError('searchTerms', errors) : null"
                    @keyup.enter="searchVolumes"
                  />
                  <v-btn class="btn btn-primary" :disabled="findingVolumes" @click.stop="searchVolumes">
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
        <table v-if="volumeList && volumeList.length > 0">
          <thead>
            <tr>
              <th>{{ messages.admin_label_volume_name }}</th>
              <th>{{ messages.admin_label_volume_mount_header }}</th>
              <th>{{ messages.label_ctime }}</th>
              <th>{{ messages.label_mtime }}</th>
              <th colspan="3">{{ messages.admin_label_volume_actions }}</th>
              <th>{{ messages.admin_button_delete_volume }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vol, volIndex) in volumeList" :key="volIndex">
              <td>{{ volumeName(vol) }}</td>
              <td>
                <div v-if="vol.readOnly">
                  {{ messages.admin_label_volume_mount_source }}
                </div>
                <div v-else>
                  {{ messages.admin_label_volume_mount_destination }}
                </div>
              </td>
              <td>{{ messages.label_date_and_time.parseDateMessage(vol.ctime, messages) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(vol.mtime, messages) }}</td>
              <td v-if="vol.readOnly">
                <NuxtLink :to="{ path: '/admin/browse', query: { volume: vol.name } }">
                  <v-btn>
                    {{ messages.admin_button_browse_volume }}
                  </v-btn>
                </NuxtLink>
              </td>
              <td v-else>
                <v-btn v-if="isSyncVolume(vol)" @click.stop="setSyncVolume(vol.name, false)">
                  {{ messages.admin_button_unsync_system_volume }}
                </v-btn>
                <v-btn v-else @click.stop="setSyncVolume(vol.name, true)">
                  {{ messages.admin_button_sync_system_volume }}
                </v-btn>
              </td>
              <td>
                <div v-if="vol.readOnly">
                  <div>
                    <v-btn v-if="!selfVolume(vol) && !scanningVolumes[vol.name]" @click.stop="setScanConfigOverlay(vol)">
                      {{ messages.admin_button_scan_volume }}
                    </v-btn>
                  </div>
                  <div v-if="scanningVolumes[vol.name]">
                    <small>
                      {{ messages.admin_info_scan_scanning }}
                    </small>
                  </div>
                  <div v-if="scanVolumeError[vol.name]">
                    <small>
                      {{ messages.admin_info_scan_error.parseMessage({ e: scanVolumeError[vol.name] }) }}
                    </small>
                  </div>
                  <div v-else-if="scanVolumeSuccess[vol.name]">
                    <small>
                      {{ messages.admin_info_scan_successful }}
                      <NuxtLink to="/admin/queue">
                        {{ messages.admin_title_transform_queue }}
                      </NuxtLink>
                    </small>
                  </div>
                </div>
              </td>
              <td>
                <div v-if="vol.readOnly">
                  <div>
                    <v-btn v-if="!selfVolume(vol) && !indexingVolumes[vol.name]" @click.stop="indexSrc(vol.name)">
                      {{ messages.admin_button_reindex_volume }}
                    </v-btn>
                  </div>
                  <div v-if="indexingVolumes[vol.name]">
                    <small>
                      {{ messages.admin_info_reindex_indexing }}
                    </small>
                  </div>
                  <div v-if="indexingStartError[vol.name]">
                    <small>
                      {{ messages.admin_info_reindex_error.parseMessage({ e: indexingStartError[vol.name] }) }}
                    </small>
                  </div>
                  <div v-else-if="indexingStartSuccess[vol.name]">
                    <small>
                      {{ messages.admin_info_reindex_successful }}
                      <NuxtLink :to="`/admin/indexes?volume=${vol.name}`">
                        {{ messages.admin_title_reindex_status }}
                      </NuxtLink>
                    </small>
                  </div>
                </div>
              </td>
              <td>
                <v-btn v-if="!selfVolume(vol)" :disabled="scanningVolumes[vol.name]" @click.stop="delVolume(vol.name)">
                  {{ messages.admin_button_delete_volume }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container>
          <v-row>
            <v-col>
              <h4>{{ messages.admin_title_add_volume }}</h4>
            </v-col>
          </v-row>
          <v-row>
            <ValidationObserver ref="addVolumeForm">
              <v-form id="addVolumeForm" @submit.prevent="addNewVolume">
                <v-select
                  v-model="newVolume.type"
                  :label="messages.admin_label_volume_type"
                  :items="volumeTypes"
                  item-text="message"
                  item-value="name"
                  class="form-control"
                  @change="setVolumeTypeDefaults"
                />
                <ValidationProvider v-slot="{ errors }" name="name" :rules="formRules.name" immediate>
                  <v-text-field
                    v-model="newVolume.name"
                    :label="messages.admin_label_volume_name"
                    type="text"
                    name="name"
                    class="form-control"
                    :error="addVolumeSubmitted && errors.length>0"
                    :error-messages="addVolumeSubmitted ? fieldError('name', errors) : null"
                  />
                </ValidationProvider>
                <v-select
                  v-model="newVolume.mount"
                  :label="messages.admin_label_volume_mount"
                  :items="volumeMounts"
                  item-text="message"
                  item-value="name"
                  class="form-control"
                />
                <div v-for="(fieldConfig, fieldName) in volumeTypeConfiguration" :key="fieldName">
                  <ValidationProvider v-slot="{ errors }" :name="fieldName" :rules="fieldConfig.rules || ''" immediate>
                    <v-text-field
                      v-if="isOpt(fieldName)"
                      v-model="newVolume.opts[fieldName]"
                      :label="messages[configFieldLabel(fieldName)]"
                      type="text"
                      :name="fieldName"
                      :value="fieldConfig.default ? fieldConfig.default : ''"
                      class="form-control"
                      :error="addVolumeSubmitted && errors.length>0"
                      :error-messages="addVolumeSubmitted ? volumeConfigFieldError(fieldName, errors) : null"
                    />
                    <v-text-field
                      v-else
                      v-model="newVolume[fieldName]"
                      :label="messages[configFieldLabel(fieldName)]"
                      type="text"
                      :name="fieldName"
                      :value="fieldConfig.default ? fieldConfig.default : ''"
                      class="form-control"
                      :error="addVolumeSubmitted && errors.length>0"
                      :error-messages="addVolumeSubmitted ? volumeConfigFieldError(fieldName, errors) : null"
                    />
                  </ValidationProvider>
                </div>
                <ValidationProvider v-slot="{ errors }" name="cacheSize" :rules="formRules.cacheSize" immediate>
                  <v-text-field
                    v-model="newVolume.cacheSize"
                    :label="messages.admin_label_volume_cacheSize"
                    type="text"
                    name="cacheSize"
                    class="form-control"
                    :error="addVolumeSubmitted && errors.length>0"
                    :error-messages="addVolumeSubmitted ? fieldError('cacheSize', errors, 'admin_label_volume_') : null"
                  />
                </ValidationProvider>
                <div>
                  <v-checkbox
                    v-model="newVolume.encryption.enabled"
                    :label="messages.admin_label_volume_encryption_enable"
                    name="encryptionEnabled"
                    class="form-control"
                  />
                  <div v-if="newVolume.encryption.enabled">
                    <ValidationProvider v-slot="{ errors }" name="encryptionKey" :rules="formRules.encryptionKey" immediate>
                      <v-text-field
                        v-model="newVolume.encryption.key"
                        :label="messages.admin_label_volume_encryption_key"
                        type="text"
                        name="encryptionKey"
                        class="form-control"
                        :error="addVolumeSubmitted && errors.length>0"
                        :error-messages="addVolumeSubmitted ? volumeConfigFieldError('encryptionKey', errors) : null"
                      />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="encryptionIV" :rules="formRules.encryptionIV" immediate>
                      <v-text-field
                        v-model="newVolume.encryption.iv"
                        :label="messages.admin_label_volume_encryption_iv"
                        type="text"
                        name="encryptionIV"
                        class="form-control"
                        :error="addVolumeSubmitted && errors.length>0"
                        :error-messages="addVolumeSubmitted ? volumeConfigFieldError('encryptionIV', errors) : null"
                      />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="encryptionAlgo" rules="min:32" immediate>
                      <v-select
                        v-model="newVolume.encryption.algo"
                        :label="messages.admin_label_volume_encryption_algo"
                        name="encryptionAlgo"
                        :items="encryptionAlgos"
                        item-text="name"
                        item-value="name"
                        class="form-control"
                        :error="addVolumeSubmitted && errors.length>0"
                        :error-messages="addVolumeSubmitted ? volumeConfigFieldError('encryptionAlgo', errors) : null"
                      />
                      <small v-if="newVolume.encryption.algo">
                        <vue-json-pretty
                          :data="selectedAlgoDetails"
                          :show-line="false"
                          :show-double-quotes="false"
                          :select-on-click-node="false"
                          :highlight-selected-node="false"
                          :collapsed-on-click-brackets="false"
                        />
                      </small>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="form-group">
                  <v-btn class="btn btn-primary" @click.stop="addNewVolume">
                    {{ messages.admin_button_add_volume }}
                  </v-btn>
                </div>
              </v-form>
            </ValidationObserver>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { DEFAULT_ENCRYPTION_ALGO, isSelfVolume, publicConfigField, isoDate, isoTime } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { condensedRules } from '@/shared/model/validation'
import {
  localizedVolumeConfigLabelPrefix, localizedVolumeConfigLabel, localizedVolumeTypes,
  volumeTypeConfig, VOLUME_VALIDATIONS, VOLUME_MOUNT_SOURCE, VOLUME_MOUNT_DESTINATION
} from '@/shared/model/volume'
import { ALL_MEDIA_PROFILES } from '@/shared/media'
import { UI_CONFIG } from '@/services/util'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 3

const NOW = new Date()

export default {
  name: 'ManageVolumes',
  components: { VueJsonPretty },
  data () {
    return {
      pageNumber: 1,
      pageSize: 20,
      searchTerms: '',
      deleteConfirmCount: 0,

      showSuccessSnackbar: false,
      successSnackTimeout: -1,
      showErrorSnackbar: false,
      errorSnackTimeout: -1,

      newVolume: {
        type: 's3',
        name: null,
        key: null,
        secret: null,
        readOnly: true,
        mount: null,
        cacheSize: 100,
        opts: {},
        encryption: { enabled: false, algo: DEFAULT_ENCRYPTION_ALGO }
      },
      addVolumeSubmitted: false,

      scanConfigOverlayObject: null,
      scanConfig: {
        ignoreErrors: false,
        overwrite: false,
        reprocess: [],
        path: '',
        olderThan: null
      },
      scanConfigOlderThan: {
        enabled: false,
        date: isoDate(NOW),
        time: isoTime(NOW)
      }
    }
  },
  computed: {
    ...mapState(['publicConfig']),
    ...mapState('user', ['user']),
    ...mapState('admin', [
      'volumeList', 'totalVolumeCount', 'findingVolumes',
      'addVolumeSuccess', 'addVolumeError', 'deleteVolumeError',
      'scanningVolumes', 'scanVolumeSuccess', 'scanVolumeError',
      'indexingVolumes', 'indexingStartSuccess', 'indexingStartError'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') },
    formRules () { return condensedRules(VOLUME_VALIDATIONS) },
    searchQuery () {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerms: this.searchTerms,
        includeSelf: false
      }
    },
    volumeTypes () { return localizedVolumeTypes(this.messages) },
    volumeTypeConfiguration () { return volumeTypeConfig(this.newVolume.type) },
    volumeMounts () {
      return [
        { name: VOLUME_MOUNT_SOURCE, message: this.messages.admin_label_volume_mount_source },
        { name: VOLUME_MOUNT_DESTINATION, message: this.messages.admin_label_volume_mount_destination }
      ]
    },
    encryptionAlgos () { return this.publicConfig && this.publicConfig.crypto ? this.publicConfig.crypto : null },
    selectedAlgoDetails () {
      if (this.newVolume.encryption.algo && this.encryptionAlgos) {
        const algo = this.encryptionAlgos.find(enc => enc.name === this.newVolume.encryption.algo)
        return algo ? algo.info : null
      }
      return null
    },
    allProfiles () { return ALL_MEDIA_PROFILES },
    allProfilesSelected () {
      return this.scanConfig.reprocess.length === this.allProfiles.length
    },
    someProfilesSelected () {
      return this.scanConfig.reprocess.length > 0 && !this.allProfilesSelected
    },
    scanConfigSelectionIcon () {
      return this.allProfilesSelected
        ? 'mdi-close-box'
        : this.someProfilesSelected
          ? 'mdi-minus-box'
          : 'mdi-checkbox-blank-outline'
    }
  },
  watch: {
    addVolumeError (newError) {
      if (newError) {
        if (newError.errors) {
          this.errorSnackTimeout = null
          this.showErrorSnackbar = false
          this.$refs.addVolumeForm.setErrors(newError.errors)
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
    addVolumeSuccess (ok) {
      if (ok) {
        // longer timeout for these kinds of things, more time to see the error
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
        this.showErrorSnackbar = false
        this.findVolumes({ query: this.searchQuery })
      } else {
        this.showSuccessSnackbar = false
        this.successSnackTimeout = null
      }
    }
  },
  created () {
    const query = this.searchQuery
    this.findVolumes({ query })
    this.setVolumeTypeDefaults()
  },
  methods: {
    ...mapActions('admin', ['findVolumes', 'addVolume', 'deleteVolume', 'scanVolume', 'indexVolume', 'setVolumeSync']),
    fieldError (field, error, labelPrefix = 'label_') {
      return field && error ? fieldErrorMessage(field, error, this.messages, labelPrefix) : '(no message)'
    },
    selfVolume (volume) { return isSelfVolume(volume) },
    isSyncVolume (volume) { return typeof volume.sync === 'boolean' && volume.sync === true },
    async setSyncVolume (volume, sync) { await this.setVolumeSync({ volume, sync }) },
    volumeName (volume) {
      return isSelfVolume(volume)
        ? this.messages.admin_label_self_volume.parseMessage({ title: this.title })
        : volume.name
    },
    isOpt (field) { return field !== 'key' && field !== 'secret' },
    volumeConfigFieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages, localizedVolumeConfigLabelPrefix(this.newVolume.type)) : '(no message)'
    },
    searchVolumes () {
      const query = this.searchQuery
      this.findVolumes({ query })
    },
    configFieldLabel (field) {
      return localizedVolumeConfigLabel(this.newVolume.type, field)
    },
    setVolumeTypeDefaults () {
      this.newVolume.opts = {}
      const config = this.volumeTypeConfiguration
      for (const field of Object.keys(config)) {
        const fieldConfig = config[field]
        if (fieldConfig.default) {
          if (this.isOpt(field)) {
            this.newVolume.opts[field] = fieldConfig.default
          } else {
            this.newVolume[field] = fieldConfig.default
          }
        }
      }
    },
    async addNewVolume () {
      this.addVolumeSubmitted = true
      this.newVolume.readOnly = this.newVolume.mount !== VOLUME_MOUNT_DESTINATION
      await this.$refs.addVolumeForm.validate().then((success) => {
        if (success) {
          this.addVolume({ volume: this.newVolume })
        }
      })
    },
    delVolume (volume) {
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages.admin_label_confirm_volume_delete.parseMessage({ volume }))) {
        this.deleteConfirmCount++
        this.deleteVolume({ volume })
      } else {
        this.deleteConfirmCount = 0
      }
    },
    setScanConfigOverlay (obj) { this.scanConfigOverlayObject = obj || null },
    scanSrc (obj) {
      if (this.scanConfigOlderThan.enabled) {
        this.scanConfig.olderThan = new Date(this.scanConfigOlderThan.date + ' ' + this.scanConfigOlderThan.time).getTime()
      } else {
        this.scanConfig.olderThan = null
      }
      const scanConfig = Object.assign({}, this.scanConfig, { volume: obj.name })
      this.scanVolume({ scanConfig })
      this.setScanConfigOverlay(null)
    },
    indexSrc (src) { this.indexVolume({ src }) },
    toggleAllProfiles () {
      this.$nextTick(() => {
        if (this.allProfilesSelected) {
          this.scanConfig.reprocess = []
        } else {
          this.scanConfig.reprocess = this.allProfiles.slice()
        }
      })
    }
  }
}
</script>

<style lang="scss">
#scanConfigOverlayContainer {
  width: 550px;
  max-height: 70%;
  height: 70%;
  overflow: scroll;
  padding: 10px;
  position: relative;
  top: 20px;
}
</style>
