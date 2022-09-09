<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-select
            v-model="source"
            :label="messages.admin_label_source_name"
            :items="sourceList"
            item-text="name"
            item-value="name"
            class="form-control"
            @change="setSource"
          />
        </v-col>
        <v-col>
          <v-btn v-if="source && !indexingStartSuccess[source] && !indexingSources[source]" @click.stop="indexSrc(source)">
            {{ messages.admin_button_reindex_source }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-if="indexingSources[source]">
            {{ messages.admin_info_reindex_indexing }}
          </div>
          <div v-if="indexingStartError[source]">
            {{ messages.admin_info_reindex_error.parseMessage({ e: indexingStartError[source] }) }}
          </div>
          <div v-else-if="indexingStartSuccess[source]">
            {{ messages.admin_info_reindex_successful }}
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <b>{{ messages.admin_label_reindex_path }}</b>
        </v-col>
        <v-col>
          <b>{{ messages.admin_label_reindex_time }}</b>
        </v-col>
        <v-col>
          <b>{{ messages.admin_label_reindex_status }}</b>
        </v-col>
      </v-row>
      <v-row v-if="reindexInfo.length === 0">
        <v-col>
          {{ messages.admin_label_reindex_noResults }}
        </v-col>
      </v-row>
      <v-row v-for="(info, index) in reindexInfo" :key="index">
        <v-col>
          {{ info.sourceAndPath }}
        </v-col>
        <v-col>
          {{ messages.label_date_and_time_short.parseDateMessage(+info.ctime, messages) }}
        </v-col>
        <v-col>
          {{ info.status }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <hr/>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="error--text">
          <v-btn :disabled="sendingBuildRequest" @click.stop="rebuildSearch">
            {{ messages.admin_button_rebuildSearchIndex }}
          </v-btn>
          <b>{{ messages.admin_button_rebuildSearchIndex_warning }}</b>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

const UPDATE_INTERVAL = 1000 * 15

export default {
  name: 'ManageIndexes',
  data () {
    return {
      source: null,
      refresher: null
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    ...mapState('admin', ['sourceList', 'indexingInfo',
      'indexingSources', 'indexingStartSuccess', 'indexingStartError',
      'sendingBuildRequest', 'buildRequestSuccess', 'sendingBuildRequestError']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    reindexInfo () {
      const s = this.source
      return this.indexingInfo && this.indexingInfo[s] && this.indexingInfo[s].length > 0
        ? this.indexingInfo[s]
        : []
    }
  },
  watch: {
    sourceList (newList) {
      if (this.source === null && newList && newList.length > 0) {
        this.source = newList[0].name
      }
    }
  },
  created () {
    this.source = this.$route.query.source || null
    const query = { includeSelf: false }
    this.findSources({ query })
    if (this.source) {
      this.indexInfo({ src: this.source })
    }
    if (!this.refresher) {
      this.refresher = setInterval(() => {
        if (this.source) {
          this.indexInfo({ src: this.source })
        }
      }, UPDATE_INTERVAL)
    }
  },
  destroyed () {
    if (this.refresher) { clearInterval(this.refresher) }
  },
  beforeUnmount () {
    if (this.refresher) { clearInterval(this.refresher) }
  },
  methods: {
    ...mapActions('admin', ['indexInfo', 'findSources', 'indexSource', 'buildSearchIndex']),
    setSource (src) {
      this.source = src
      this.indexInfo({ src: this.source })
    },
    indexSrc (src) { this.indexSource({ src }) },
    rebuildSearch () { this.buildSearchIndex() }
  }
}
</script>
