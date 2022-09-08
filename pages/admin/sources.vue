<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_source_administration }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="showSuccessSnackbar && addSourceSuccess">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            {{ messages.admin_info_source_added.parseMessage({ source: newSource.name }) }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && addSourceError">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{ messages.admin_info_source_add_error.parseMessage({ source: newSource.name }) }}
          </h4>
          <small>
            <vue-json-pretty
              :data="addSourceError"
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
    <v-row v-if="totalSourceCount > 0">
      <v-col>
        <div>
          <ValidationObserver ref="form">
            <v-form @submit.prevent="searchSources">
              <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                <div class="form-group">
                  <v-text-field
                    v-model="searchTerms"
                    :label="messages.label_search"
                    type="text"
                    name="searchTerms"
                    class="form-control"
                    :error="addSourceSubmitted && errors.length>0"
                    :error-messages="addSourceSubmitted ? fieldError('searchTerms', errors) : null"
                    @keyup.enter="searchSources"
                  />
                  <v-btn class="btn btn-primary" :disabled="findingSources" @click.stop="searchSources">
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
        <table v-if="sourceList && sourceList.length > 0">
          <thead>
            <tr>
              <th>{{ messages.admin_label_source_name }}</th>
              <th>{{ messages.label_ctime }}</th>
              <th>{{ messages.label_mtime }}</th>
              <th>{{ messages.admin_button_browse_source }}</th>
              <th>{{ messages.admin_button_scan_source }}</th>
              <th>{{ messages.admin_button_reindex_source }}</th>
              <th>{{ messages.admin_button_delete_source }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(src, srcIndex) in sourceList" :key="srcIndex">
              <td>{{ sourceName(src) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(src.ctime, messages) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(src.mtime, messages) }}</td>
              <td>
                <v-btn v-if="!isSelfSource(src)" :href="`/admin/browse?source=${src.name}`">
                  {{ messages.admin_button_browse_source }}
                </v-btn>
              </td>
              <td>
                <div>
                  <v-btn v-if="!isSelfSource(src) && !scanningSources[src.name]" @click.stop="scanSrc(src.name)">
                    {{ messages.admin_button_scan_source }}
                  </v-btn>
                </div>
                <div v-if="scanningSources[src.name]">
                  <small>
                    {{ messages.admin_info_scan_scanning }}
                  </small>
                </div>
                <div v-if="scanSourceError[src.name]">
                  <small>
                    {{ messages.admin_info_scan_error.parseMessage({ e: scanSourceError[src.name] }) }}
                  </small>
                </div>
                <div v-else-if="scanSourceSuccess[src.name]">
                  <small>
                    {{ messages.admin_info_scan_successful }}
                    <NuxtLink to="/admin/queue">
                      {{ messages.admin_title_transform_queue }}
                    </NuxtLink>
                  </small>
                </div>
              </td>
              <td>
                <div>
                  <v-btn v-if="!isSelfSource(src) && !indexingSources[src.name]" @click.stop="indexSrc(src.name)">
                    {{ messages.admin_button_reindex_source }}
                  </v-btn>
                </div>
                <div v-if="indexingSources[src.name]">
                  <small>
                    {{ messages.admin_info_reindex_indexing }}
                  </small>
                </div>
                <div v-if="indexingStartError[src.name]">
                  <small>
                    {{ messages.admin_info_reindex_error.parseMessage({ e: indexingStartError[src.name] }) }}
                  </small>
                </div>
                <div v-else-if="indexingStartSuccess[src.name]">
                  <small>
                    {{ messages.admin_info_reindex_successful }}
                    <NuxtLink :to="`/admin/indexes?source=${src.name}`">
                      {{ messages.admin_title_reindex_status }}
                    </NuxtLink>
                  </small>
                </div>
              </td>
              <td>
                <v-btn v-if="!isSelfSource(src)" :disabled="scanningSources[src.name]" @click.stop="delSource(src.name)">
                  {{ messages.admin_button_delete_source }}
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
              <h4>{{ messages.admin_title_add_source }}</h4>
            </v-col>
          </v-row>
          <v-row>
            <ValidationObserver ref="addSrcForm">
              <v-form id="addSrcForm" @submit.prevent="addSrc">
                <v-select
                  v-model="newSource.type"
                  :label="messages.admin_label_source_type"
                  :items="sourceTypes"
                  item-text="message"
                  item-value="name"
                  class="form-control"
                  @change="setSourceTypeDefaults"
                />
                <ValidationProvider v-slot="{ errors }" name="name" :rules="formRules.source" immediate>
                  <v-text-field
                    v-model="newSource.name"
                    :label="messages.admin_label_source_name"
                    type="text"
                    name="name"
                    class="form-control"
                    :error="addSourceSubmitted && errors.length>0"
                    :error-messages="addSourceSubmitted ? fieldError('name', errors) : null"
                  />
                </ValidationProvider>
                <v-checkbox
                  v-model="newSource.readOnly"
                  :label="messages.admin_label_source_readOnly"
                  name="readOnly"
                  class="form-control"
                />
                <ValidationProvider v-slot="{ errors }" name="name" :rules="formRules.cacheSize" immediate>
                  <v-text-field
                    v-model="newSource.cacheSize"
                    :label="messages.admin_label_source_cacheSize"
                    type="text"
                    name="cacheSize"
                    class="form-control"
                    :error="addSourceSubmitted && errors.length>0"
                    :error-messages="addSourceSubmitted ? fieldError('cacheSize', errors) : null"
                  />
                </ValidationProvider>
                <div v-for="(fieldConfig, fieldName) in sourceTypeConfiguration" :key="fieldName">
                  <ValidationProvider v-slot="{ errors }" :name="fieldName" :rules="fieldConfig.rules || ''" immediate>
                    <v-text-field
                      v-if="isOpt(fieldName)"
                      v-model="newSource.opts[fieldName]"
                      :label="messages[configFieldLabel(fieldName)]"
                      type="text"
                      :name="fieldName"
                      :value="fieldConfig.default ? fieldConfig.default : ''"
                      class="form-control"
                      :error="addSourceSubmitted && errors.length>0"
                      :error-messages="addSourceSubmitted ? srcConfigFieldError(fieldName, errors) : null"
                    />
                    <v-text-field
                      v-else
                      v-model="newSource[fieldName]"
                      :label="messages[configFieldLabel(fieldName)]"
                      type="text"
                      :name="fieldName"
                      :value="fieldConfig.default ? fieldConfig.default : ''"
                      class="form-control"
                      :error="addSourceSubmitted && errors.length>0"
                      :error-messages="addSourceSubmitted ? srcConfigFieldError(fieldName, errors) : null"
                    />
                  </ValidationProvider>
                </div>
                <div>
                  <v-checkbox
                    v-model="newSource.encryption.enabled"
                    :label="messages.admin_label_source_encryption_enable"
                    name="encryptionEnabled"
                    class="form-control"
                  />
                  <div v-if="newSource.encryption.enabled">
                    <ValidationProvider v-slot="{ errors }" name="encryptionKey" :rules="formRules.encryptionKey" immediate>
                      <v-text-field
                        v-model="newSource.encryption.key"
                        :label="messages.admin_label_source_encryption_key"
                        type="text"
                        name="encryptionKey"
                        class="form-control"
                        :error="addSourceSubmitted && errors.length>0"
                        :error-messages="addSourceSubmitted ? srcConfigFieldError('encryptionKey', errors) : null"
                      />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="encryptionIV" :rules="formRules.encryptionIV" immediate>
                      <v-text-field
                        v-model="newSource.encryption.iv"
                        :label="messages.admin_label_source_encryption_iv"
                        type="text"
                        name="encryptionIV"
                        class="form-control"
                        :error="addSourceSubmitted && errors.length>0"
                        :error-messages="addSourceSubmitted ? srcConfigFieldError('encryptionIV', errors) : null"
                      />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="encryptionAlgo" rules="min:32" immediate>
                      <v-select
                        v-model="newSource.encryption.algo"
                        :label="messages.admin_label_source_encryption_algo"
                        name="encryptionAlgo"
                        :items="encryptionAlgos"
                        item-text="name"
                        item-value="name"
                        class="form-control"
                        :error="addSourceSubmitted && errors.length>0"
                        :error-messages="addSourceSubmitted ? srcConfigFieldError('encryptionAlgo', errors) : null"
                      />
                      <small v-if="newSource.encryption.algo">
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
                  <v-btn class="btn btn-primary" @click.stop="addSrc">
                    {{ messages.admin_button_add_source }}
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
import { DEFAULT_ENCRYPTION_ALGO, SELF_SOURCE_NAME, publicConfigField } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { condensedRules } from '@/shared/validation'
import {
  localizedSourceConfigLabelPrefix, localizedSourceConfigLabel, localizedSourceTypes, sourceTypeConfig
} from '@/shared/source'
import { UI_CONFIG } from '@/services/util'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 5

export default {
  name: 'ManageSources',
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

      newSource: {
        type: 's3',
        name: null,
        key: null,
        secret: null,
        readOnly: true,
        cacheSize: 100,
        opts: {},
        encryption: { enabled: false, algo: DEFAULT_ENCRYPTION_ALGO }
      },
      addSourceSubmitted: false
    }
  },
  computed: {
    ...mapState(['publicConfig']),
    ...mapState('user', ['user']),
    ...mapState('admin', [
      'sourceList', 'totalSourceCount', 'findingSources',
      'addSourceSuccess', 'addSourceError', 'deleteSourceError',
      'scanningSources', 'scanSourceSuccess', 'scanSourceError',
      'indexingSources', 'indexingStartSuccess', 'indexingStartError'
    ]),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') },
    formRules () { return condensedRules() },
    searchQuery () {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerms: this.searchTerms
      }
    },
    sourceTypes () { return localizedSourceTypes(this.messages) },
    sourceTypeConfiguration () { return sourceTypeConfig(this.newSource.type) },
    encryptionAlgos () { return this.publicConfig && this.publicConfig.crypto ? this.publicConfig.crypto : null },
    selectedAlgoDetails () {
      if (this.newSource.encryption.algo && this.encryptionAlgos) {
        const algo = this.encryptionAlgos.find(enc => enc.name === this.newSource.encryption.algo)
        return algo ? algo.info : null
      }
      return null
    }
  },
  watch: {
    addSourceError (newError) {
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
    addSourceSuccess (ok) {
      if (ok) {
        // longer timeout for these kinds of things, more time to see the error
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
        this.showErrorSnackbar = false
        this.findSources({ query: this.searchQuery })
      } else {
        this.showSuccessSnackbar = false
        this.successSnackTimeout = null
      }
    }
  },
  created () {
    const query = this.searchQuery
    this.findSources({ query })
    this.setSourceTypeDefaults()
  },
  methods: {
    ...mapActions('admin', ['findSources', 'addSource', 'deleteSource', 'scanSource', 'indexSource']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    isSelfSource (source) { return source.name === SELF_SOURCE_NAME },
    sourceName (source) {
      return this.isSelfSource(source)
        ? this.messages.admin_label_self_source.parseMessage({ title: this.title })
        : source.name
    },
    isOpt (field) { return field !== 'key' && field !== 'secret' },
    srcConfigFieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages, localizedSourceConfigLabelPrefix(this.newSource.type)) : '(no message)'
    },
    searchSources () {
      const query = this.searchQuery
      this.findSources({ query })
    },
    configFieldLabel (field) {
      return localizedSourceConfigLabel(this.newSource.type, field)
    },
    setSourceTypeDefaults () {
      this.newSource.opts = {}
      const config = this.sourceTypeConfiguration
      for (const field of Object.keys(config)) {
        const fieldConfig = config[field]
        if (fieldConfig.default) {
          if (this.isOpt(field)) {
            this.newSource.opts[field] = fieldConfig.default
          } else {
            this.newSource[field] = fieldConfig.default
          }
        }
      }
    },
    async addSrc () {
      this.addSourceSubmitted = true
      await this.$refs.addSrcForm.validate().then((success) => {
        if (success) {
          this.addSource({ src: this.newSource })
        }
      })
    },
    delSource (src) {
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages.admin_label_confirm_source_delete.parseMessage({ source: src }))) {
        this.deleteConfirmCount++
        this.deleteSource({ src })
      } else {
        this.deleteConfirmCount = 0
      }
    },
    scanSrc (src) { this.scanSource({ src }) },
    indexSrc (src) { this.indexSource({ src }) }
  }
}
</script>
