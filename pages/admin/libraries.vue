<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_library_administration }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar && addLibrarySuccess">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            {{ messages.admin_info_library_added.parseMessage({ library: newLibrary.name }) }}
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
    <v-row v-if="totalLibraryCount > 0">
      <v-col>
        <div>
          <ValidationObserver ref="form">
            <v-form @submit.prevent="searchLibrarys">
              <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                <div class="form-group">
                  <v-text-field
                    v-model="searchTerms"
                    :label="messages.label_search"
                    type="text"
                    name="searchTerms"
                    class="form-control"
                    :error="addLibrarySubmitted && errors.length>0"
                    :error-messages="addLibrarySubmitted ? fieldError('searchTerms', errors) : null"
                    @keyup.enter="searchLibrarys"
                  />
                  <v-btn class="btn btn-primary" :disabled="findingLibrarys" @click.stop="searchLibrarys">
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
              <th>{{ messages.admin_label_library_source }}</th>
              <th />
              <th>{{ messages.admin_label_library_destination }}</th>
              <th>{{ messages.label_ctime }}</th>
              <th>{{ messages.label_mtime }}</th>
              <th>{{ messages.admin_button_delete_library }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(library, libraryIndex) in libraryList" :key="libraryIndex">
              <td>{{ library.source }}</td>
              <td><h4>→</h4></td>
              <td>{{ library.destination }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(library.ctime, messages) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(library.mtime, messages) }}</td>
              <td>
                <v-btn @click.stop="delLibrary(library.hash)">
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
        <v-container>
          <v-row>
            <v-col>
              <h4>{{ messages.admin_title_add_library }}</h4>
            </v-col>
          </v-row>
          <v-row>
            <ValidationObserver ref="addLibraryForm">
              <v-form id="addLibraryForm" @submit.prevent="addLibrary">
                <ValidationProvider v-slot="{ errors }" name="name" :rules="formRules.name" immediate>
                  <v-text-field
                    v-model="newLibrary.name"
                    :label="messages.admin_label_library_name"
                    type="text"
                    name="name"
                    class="form-control"
                    :error="addVolumeSubmitted && errors.length>0"
                    :error-messages="addVolumeSubmitted ? fieldError('name', errors) : null"
                  />
                </ValidationProvider>
                <v-select
                  v-model="newLibrary.source"
                  :label="messages.admin_label_library_sources"
                  :items="sourceList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                />
                <v-select
                  v-model="newLibrary.destination"
                  :label="messages.admin_label_library_destination"
                  :items="destinationList"
                  item-text="name"
                  item-value="name"
                  class="form-control"
                />
                <div class="form-group">
                  <v-btn class="btn btn-primary" @click.stop="addLibrary">
                    {{ messages.admin_button_add_library }}
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
import { publicConfigField, SELF_VOLUME_NAME } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { condensedRules } from '@/shared/validation'
import { UI_CONFIG } from '@/services/util'
import { filterSources, filterDestinations, isSelfDestinationVolume, LIBRARY_VALIDATIONS } from '@/shared/volume'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 3

// const NOW = new Date()

export default {
  name: 'ManageLibraries',
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

      newLibrary: {
        sources: [],
        destinations: SELF_VOLUME_NAME
      },
      addLibrarySubmitted: false
    }
  },
  computed: {
    ...mapState(['publicConfig']),
    ...mapState('user', ['user']),
    ...mapState('admin', [
      'volumeList', 'libraryList', 'totalLibraryCount', 'findingLibraries',
      'addLibrarySuccess', 'addLibraryError', 'deleteLibrarySuccess', 'deleteLibraryError'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    selfName () { return this.messages.admin_label_self_volume.parseMessage({ title: publicConfigField(this, 'title') }) },
    sourceList () { return filterSources(this.volumeList) },
    destinationList () {
      const destinations = filterDestinations(this.volumeList)
      const adjusted = []
      for (let i = 0; i < destinations.length; i++) {
        const v = destinations[i]
        if (isSelfDestinationVolume(v)) {
          adjusted.push(Object.assign({}, v, { name: this.selfName }))
        } else {
          adjusted.push(v)
        }
      }
      return adjusted
    },
    title () { return publicConfigField(this, 'title') },
    formRules () { return condensedRules(LIBRARY_VALIDATIONS) },
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
      if (ok) {
        // longer timeout for these kinds of things, more time to see the error
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
        this.showErrorSnackbar = false
        this.findLibrarys({ query: this.searchQuery })
      } else {
        this.showSuccessSnackbar = false
        this.successSnackTimeout = null
      }
    }
  },
  created () {
    const query = this.searchQuery
    this.findVolumes({ query: { includeSelf: true } })
    this.findLibrarys({ query })
  },
  methods: {
    ...mapActions('admin', ['findLibrarys', 'findVolumes', 'addLibrary', 'deleteLibrary']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    adjustForSelf (volume) { return volume === this.selfName ? SELF_VOLUME_NAME : volume },
    searchLibrarys () {
      const query = this.searchQuery
      this.findLibrarys({ query })
    },
    async addLibrary () {
      this.addLibrarySubmitted = true
      await this.$refs.addLibraryForm.validate().then((success) => {
        if (success) {
          this.addLibrary({ src: this.newLibrary })
        }
      })
    },
    delLibrary (library) {
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages.admin_label_confirm_library_delete.parseMessage({
          source: library.source,
          destination: this.adjustForSelf(library.destination)
        }))) {
        this.deleteConfirmCount++
        this.deleteLibrary({ library })
      } else {
        this.deleteConfirmCount = 0
      }
    }
  }
}
</script>
