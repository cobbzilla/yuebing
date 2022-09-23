<template>
  <v-container>
    <v-row>
      <v-col>
        <SearchBar :search="searchTerms" @update="onSearchUpdate" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container fluid>
          <v-row v-if="searching">
            <v-col>
              <h2>
                {{ messages.info_search_searching }}
              </h2>
            </v-col>
          </v-row>
          <v-row v-else-if="searchIndexesBuilding">
            <v-col>
              <h4>{{ messages.info_search_indexes_building.parseMessage({ indexes: searchIndexesBuilding.join(messages.locale_text_list_separator) }) }}</h4>
            </v-col>
          </v-row>
          <v-row v-else-if="!searching && (!searchResults || searchResults.length === 0)">
            <v-col>
              <div v-if="unverifiedUserAndNotPublic">
                <h2>
                  {{ messages.info_search_no_results_unverified.parseMessage({ email: user.email }) }}
                </h2>
              </div>
              <div v-else-if="tagWeights && tagWeights.length > 0">
                <vue-word-cloud
                  id="searchTagCloud"
                  :words="tagWeights"
                  color="WhiteSmoke"
                  font-family="Roboto, sans-serif"
                >
                  <template #default="{word}">
                    <div style="cursor: pointer;" @click="tagSearch(word[0])">
                      {{ word[0] }}
                    </div>
                  </template>
                </vue-word-cloud>
              </div>
              <div v-else>
                <h2>
                  {{ messages.info_search_no_results }}
                </h2>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <div v-for="(obj, index) in searchResults" :key="index">
              <v-spacer />
              <v-col>
                <v-card class="searchResultCard">
                  <v-card-title>
                    <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: encPath(obj.path)}}">
                      {{ displayName(obj.name) }}
                    </NuxtLink>
                  </v-card-title>
                  <v-card-text>
                    <NuxtLink :to="{ path: '/media/'+obj.mediaType, query: { n: encPath(obj.path) } }">
                      <img
                        v-if="thumbnail(obj)"
                        :src="proxyUrl(thumbnail(obj))"
                        width="200"
                        :alt="messages.thumbnail_alt_text.parseMessage({ name: displayName(obj.name) })"
                      >
                    </NuxtLink>
                  </v-card-text>
                </v-card>
              </v-col>
              <!-- <v-spacer />-->
            </div>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'

import VueWordCloud from 'vuewordcloud'
import SearchBar from '@/components/SearchBar'

import { proxyMediaUrl, splitSearchTerms } from '@/shared'
import { objectEncodePath } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ListObjects',
  components: { SearchBar, VueWordCloud },
  data () {
    return {
      searchTerms: '',
      offset: 0
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig', 'searching', 'searchResults', 'searchIndexesBuilding', 'searchError']),
    ...mapState('tags', ['tagWeights']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    unverifiedUserAndNotPublic () {
      return this.publicConfig && this.publicConfig.public === false &&
        this.user && this.user.email && this.userStatus && !this.user.verified
    },
    query () {
      return {
        tags: splitSearchTerms(this.searchTerms),
        offset: this.offset
      }
    }
  },
  created () {
    this.runSearch()
    if (!this.tagWeights) {
      this.fetchTagWeights()
    }
  },
  methods: {
    ...mapActions(['searchContent']),
    ...mapActions('tags', ['fetchTagWeights']),
    thumbnail (obj) { return findThumbnail(obj) },
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) },
    displayName (name) { return name ? name.replaceAll('_', ' ') : name },
    runSearch () {
      const query = this.query
      this.searchContent({ query })
    },
    onSearchUpdate (update) {
      this.searchTerms = update
      this.runSearch()
    },
    tagSearch (tag) {
      this.searchTerms = tag
      this.runSearch()
    },
    encPath (path) { return objectEncodePath(path) }
  }
}
</script>

<style lang="scss" scoped>
.searchResultCard {
  min-height: 200px;
  min-width: 200px;
  max-height: 400px;
  max-width: 500px;
}
#searchTagCloud {
  display: block;
  min-height: 200px;
  max-height: 600px;
  min-width: 300px;
}
</style>
