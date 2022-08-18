<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_source_administration }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="totalSourceCount > 0">
      <v-col>
        <div>
          <ValidationObserver ref="form">
            <form>
              <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                <div class="form-group">
                  <v-text-field
                    v-model="searchTerms"
                    :label="messages.label_search"
                    type="text"
                    name="searchTerms"
                    class="form-control"
                    :class="{ 'is-invalid': errors.length>0 }"
                  />
                  <span v-show="errors.length>0" class="is-invalid">{{ fieldError('searchTerms', errors[0]) }}</span>
                  <v-btn class="btn btn-primary" :disabled="findingSources" @click.stop="searchSources">
                    {{ messages.button_search }}
                  </v-btn>
                </div>
              </ValidationProvider>
            </form>
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
              <th>{{ messages.admin_button_delete_source }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(src, srcIndex) in sourceList" :key="srcIndex">
              <td>{{ src.name }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(src.ctime, messages) }}</td>
              <td>{{ messages.label_date_and_time.parseDateMessage(src.mtime, messages) }}</td>
              <td>
                <v-btn @click.stop="delSource(src.name)">
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
              <form id="addSrcForm">
                <v-select
                  v-model="newSource.type"
                  :label="messages.admin_label_source_type"
                  :items="sourceTypes"
                  item-text="message"
                  item-value="name"
                  class="form-control"
                />
                <ValidationProvider v-slot="{ errors }" name="name" rules="required|max:100" immediate>
                  <v-text-field
                    v-model="newSource.name"
                    :label="messages.admin_label_source_name"
                    type="text"
                    name="name"
                    class="form-control"
                    :class="{ 'is-invalid': errors.length>0 }"
                  />
                  <span v-show="addSourceSubmitted && errors.length>0" class="is-invalid">{{ fieldError('name', errors[0]) }}</span>
                </ValidationProvider>
                <div v-for="(fieldConfig, fieldName) in sourceTypeConfiguration" :key="fieldName">
<!--                  fieldName={{ fieldName }} JSON.stringify(fieldName)= {{ JSON.stringify(fieldName, null, 2) }}<br/>-->
<!--                  fieldConfig.default={{ fieldConfig.default }} JSON.stringify(fieldConfig)= {{ JSON.stringify(fieldConfig, null, 2) }}<br/>-->
                  <ValidationProvider v-slot="{ errors }" :name="fieldName" :rules="fieldConfig.rules || ''" immediate>
                    <v-text-field
                      v-model="newSource.config[fieldName]"
                      :label="messages[configFieldLabel(fieldName)]"
                      type="text"
                      :name="fieldName"
                      class="form-control"
                      :class="{ 'is-invalid': errors.length>0 }"
                    />
                    <span v-show="addSourceSubmitted && errors.length>0" class="is-invalid">{{ srcConfigFieldError(fieldName, errors[0]) }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group">
                  <v-btn class="btn btn-primary" @click.stop="addSrc">
                    {{ messages.admin_button_add_source }}
                  </v-btn>
                </div>
              </form>
            </ValidationObserver>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import {
  localizedSourceConfigLabelPrefix, localizedSourceConfigLabel, localizedSourceTypes, sourceTypeConfig
} from '@/shared/source'

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 5

export default {
  name: 'ManageSources',
  data () {
    return {
      pageNumber: 1,
      pageSize: 20,
      searchTerms: '',
      deleteConfirmCount: 0,
      newSource: {
        type: 's3',
        name: null,
        config: {}
      },
      addSourceSubmitted: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('admin', ['sourceList', 'totalSourceCount', 'findingSources', 'addSourceError', 'deleteSourceError']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    searchQuery () {
      return {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerms: this.searchTerms
      }
    },
    sourceTypes () { return localizedSourceTypes(this.messages) },
    sourceTypeConfiguration () { return sourceTypeConfig(this.newSource.type) }
  },
  created () {
    const query = this.searchQuery
    this.findSources({ query })
  },
  methods: {
    ...mapActions('admin', ['findSources', 'addSource', 'deleteSource']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
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
    async addSrc () {
      this.addSourceSubmitted = true
      await this.$refs.addSrcForm.validate().then((success) => {
        if (success) {
          console.log(`addSrc: would add source: ${JSON.stringify(this.newSource, null, 2)}`)
          this.addSource({ src: this.newSource })
          return
        }
        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    delSource (src) {
      if (this.deleteConfirmCount > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
        confirm(this.messages.admin_label_confirm_source_delete.parseMessage({ src }))) {
        this.deleteConfirmCount++
        this.deleteSource({ src })
      } else {
        this.deleteConfirmCount = 0
      }
    }
  }
}
</script>
