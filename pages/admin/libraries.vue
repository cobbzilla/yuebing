<template>
  <v-container>
    <v-overlay
      v-if="libraryOverlay && libraryOverlay.unsaved"
      :value="libraryOverlay"
    >
      <v-container id="libraryOverlayContainer" fluid>
        <v-row>
          <v-col>
            <h4 v-if="libraryOverlay.create">
              {{ messages.admin_title_add_library }}
            </h4>
            <h4 v-else>
              {{ messages.admin_title_update_library }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <ValidationObserver ref="libraryForm">
            <v-form id="libraryForm" @submit.prevent="doSaveLibrary">
              <ValidationProvider v-slot="{ errors }" name="name" :rules="formRules.name" immediate>
                <v-text-field
                  v-model="libraryOverlay.name"
                  :label="messages.admin_label_library_name"
                  type="text"
                  name="name"
                  class="form-control"
                  :error="saveLibrarySubmitted && errors.length>0"
                  :error-messages="saveLibrarySubmitted ? fieldError('name', errors) : null"
                />
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="sources" immediate>
                <v-select
                  v-model="libraryOverlay.sources"
                  :label="messages.admin_label_library_sources"
                  :items="sourceList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                  multiple
                  :error="saveLibrarySubmitted && errors.length>0"
                  :error-messages="saveLibrarySubmitted ? fieldError('sources', errors) : null"
                />
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="destinations" immediate>
                <v-select
                  v-model="libraryOverlay.destinations"
                  :label="messages.admin_label_library_destinations"
                  :items="destinationList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                  multiple
                  :error="saveLibrarySubmitted && errors.length>0"
                  :error-messages="saveLibrarySubmitted ? fieldError('destinations', errors) : null"
                />
              </ValidationProvider>

              <v-checkbox v-model="libraryOverlay.autoscan.enabled" :label="messages.admin_label_privateConfig_autoscan_enabled" />

              <DurationField
                v-if="libraryOverlay.autoscan.enabled"
                :field="'autoscanIntervalField'"
                :field-value="libraryOverlay.autoscan.interval"
                :field-rules="publicConfig.autoscanIntervalField.rules"
                :field-label="'admin_label_privateConfig_autoscan_interval'"
                @update="onSetAutoscanInterval"
              />

              <div class="form-group">
                <v-btn v-if="libraryOverlay.create" class="btn btn-primary" @click.stop="doSaveLibrary">
                  {{ messages.admin_button_add_library }}
                </v-btn>
                <v-btn v-else class="btn btn-primary" @click.stop="doSaveLibrary">
                  {{ messages.admin_button_update_library }}
                </v-btn>
                <v-btn class="btn btn-primary" @click.stop="libraryOverlay = null">
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </div>
            </v-form>
          </ValidationObserver>
        </v-row>
      </v-container>
    </v-overlay>

    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_library_administration }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar && addLibrarySuccess">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            {{ messages.admin_info_library_added.parseMessage({ library: recentlySavedLibrary.name }) }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar && updateLibrarySuccess">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            {{ messages.admin_info_library_updated.parseMessage({ library: recentlySavedLibrary.name }) }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && addLibraryError">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{ messages.admin_info_library_add_error }}
          </h4>
          <small>
            <vue-json-pretty
              :data="addLibraryError"
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
    <v-row v-if="showErrorSnackbar && updateLibraryError">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{ messages.admin_info_library_update_error }}
          </h4>
          <small>
            <vue-json-pretty
              :data="updateLibraryError"
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
    <v-row v-if="totalLibraryCount > 0">
      <v-col>
        <div>
          <ValidationObserver ref="form">
            <v-form @submit.prevent="searchLibraries">
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
                    @keyup.enter="searchLibraries"
                  />
                  <v-btn class="btn btn-primary" :disabled="findingLibraries" @click.stop="searchLibraries">
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
        <table v-if="libraryList && libraryList.length > 0">
          <thead>
            <tr>
              <th>{{ messages.admin_label_library_name }}</th>
              <th>{{ messages.admin_label_library_sources }}</th>
              <th />
              <th>{{ messages.admin_label_library_destinations }}</th>
              <th>{{ messages.label_ctime }}</th>
              <th>{{ messages.label_mtime }}</th>
              <th>{{ messages.admin_title_update_library }}</th>
              <th>{{ messages.admin_button_delete_library }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(library, libraryIndex) in libraryList" :key="libraryIndex">
              <td>
                <strong>{{ library.name }}</strong>
              </td>
              <td>
                <table border="1">
                  <tr v-for="(srcName, srcIndex) in library.sources" :key="srcIndex">
                    <td>{{ srcName }}</td>
                  </tr>
                </table>
              </td>
              <td><h4>→</h4></td>
              <td>
                <table border="1">
                  <tr v-for="(destName, destIndex) in library.destinations" :key="destIndex">
                    <td>{{ normalizeDestName(destName) }}</td>
                  </tr>
                </table>
              </td>
              <td>{{ messages.label_date_and_time.parseDateMessage(library.ctime, messages) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(library.mtime, messages) }}</td>
              <td>
                <v-btn
                  :disabled="libraryOverlay && libraryOverlay.unsaved"
                  @click.stop="setupLibraryEditor(library.name)"
                >
                  {{ messages.admin_button_update_library }}
                </v-btn>
              </td>
              <td>
                <v-btn @click.stop="delLibrary(library.name)">
                  {{ messages.admin_button_delete_library }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click.stop="setupLibraryEditor(null)">
          {{ messages.admin_button_add_library }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'

import VueJsonPretty from 'vue-json-pretty'
import DurationField from '@/components/DurationField'
import 'vue-json-pretty/lib/styles.css'

import { publicConfigField, SELF_VOLUME_NAME, isSelfVolume } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { condensedRules } from '@/shared/model/validation'
import { UI_CONFIG } from '@/services/util'
import { filterSources, filterDestinations } from '@/shared/model/volume'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 3

// const NOW = new Date()

export default {
  name: 'ManageLibraries',
  components: { VueJsonPretty, DurationField },
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

      libraryOverlay: null,

      newLibrary: {
        sources: [],
        destinations: [],
        autoscan: {
          enabled: true,
          // default 24 hours
          interval: 1000 * 60 * 60 * 24
        }
      },
      saveLibrarySubmitted: false
    }
  },
  computed: {
    ...mapState(['publicConfig']),
    ...mapState('user', ['user']),
    ...mapState('admin', [
      'volumeList', 'libraryList', 'totalLibraryCount', 'findingLibraries', 'recentlySavedLibrary',
      'addLibrarySuccess', 'addLibraryError',
      'updateLibrarySuccess', 'updateLibraryError',
      'deleteLibrarySuccess', 'deleteLibraryError'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    selfName () { return this.messages.admin_label_self_volume.parseMessage({ title: publicConfigField(this, 'title') }) },
    sourceList () { return filterSources(this.volumeList) },
    destinationList () {
      const destinations = filterDestinations(this.volumeList)
      const adjusted = []
      for (let i = 0; i < destinations.length; i++) {
        const v = destinations[i]
        if (isSelfVolume(v)) {
          adjusted.push(Object.assign({}, v, { name: this.selfName, selfName: SELF_VOLUME_NAME }))
        } else {
          adjusted.push(v)
        }
      }
      return adjusted
    },
    title () { return publicConfigField(this, 'title') },
    formRules () { return condensedRules() },
    searchQuery () {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerms: this.searchTerms
      }
    }
  },
  watch: {
    addLibraryError (newError) {
      if (newError) {
        // longer timeout for these kinds of things, more time to see the error
        this.errorSnackTimeout = 2 * UI_CONFIG.snackbarErrorTimeout
        this.showErrorSnackbar = true
        this.showSuccessSnackbar = false
      } else {
        this.errorSnackTimeout = null
        this.showErrorSnackbar = false
      }
    },
    addLibrarySuccess (ok) {
      this.refreshLibrariesAfterSave(ok)
    },
    updateLibrarySuccess (ok) {
      this.refreshLibrariesAfterSave(ok)
    }
  },
  created () {
    const query = this.searchQuery
    this.findVolumes({ query: { includeSelf: true } })
    this.findLibraries({ query })
  },
  methods: {
    ...mapActions('admin', ['findLibraries', 'findVolumes', 'addLibrary', 'updateLibrary', 'deleteLibrary']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    adjustForSelf (volume) { return isSelfVolume(volume) ? SELF_VOLUME_NAME : volume },
    refreshLibrariesAfterSave (ok) {
      if (ok) {
        // longer timeout for these kinds of things, more time to see the error
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
        this.showErrorSnackbar = false
        this.findLibraries({ query: this.searchQuery })
        this.libraryOverlay = null
      } else {
        this.showSuccessSnackbar = false
        this.successSnackTimeout = null
      }
    },
    searchLibraries () {
      const query = this.searchQuery
      this.findLibraries({ query })
    },
    setupLibraryEditor (name) {
      const libs = this.libraryList
      if (name === null) {
        this.libraryOverlay = Object.assign({}, this.newLibrary)
      } else {
        const maybeLibrary = Array.isArray(libs) && libs.length > 0 ? libs.find(lib => lib.name === name) : null
        if (maybeLibrary) {
          this.libraryOverlay = Object.assign({}, maybeLibrary)
          this.libraryOverlay.autoscan = Object.assign({}, maybeLibrary.autoscan)
        } else {
          this.libraryOverlay = null
        }
      }
      if (this.libraryOverlay) {
        this.libraryOverlay.unsaved = true
        this.libraryOverlay.create = (name == null)
        if (this.libraryOverlay.destinations) {
          const adjustedForSelf = this.libraryOverlay.destinations.map(destName => destName === SELF_VOLUME_NAME ? this.selfName : destName)
          this.libraryOverlay.destinations = adjustedForSelf
        }
      }
    },
    async doSaveLibrary () {
      if (!this.libraryOverlay) {
        return
      }
      const toSave = this.libraryOverlay
      this.saveLibrarySubmitted = true
      const adjustedForSelf = toSave.destinations.map((destName) => {
        const dest = this.destinationList.find(d => d.name === destName)
        return dest && dest.selfName === SELF_VOLUME_NAME ? SELF_VOLUME_NAME : destName
      })
      this.libraryOverlay.destinations = toSave.destinations = adjustedForSelf
      await this.$refs.libraryForm.validate().then((success) => {
        if (success) {
          if (this.libraryOverlay.create) {
            this.addLibrary({ library: toSave })
          } else {
            this.updateLibrary({ library: toSave })
          }
        }
      })
    },
    delLibrary (library) {
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages.admin_label_confirm_library_delete.parseMessage({
          library: this.adjustForSelf(library)
        }))) {
        this.deleteConfirmCount++
        this.deleteLibrary({ library })
      } else {
        this.deleteConfirmCount = 0
      }
    },
    onSetAutoscanInterval (update) {
      // console.log(`onSetAutoscanInterval received update: ${JSON.stringify(update)}`)
      this.libraryOverlay.autoscan.interval = update.value
    },
    normalizeDestName (destName) { return isSelfVolume(destName) ? this.selfName : destName }
  }
}
</script>
