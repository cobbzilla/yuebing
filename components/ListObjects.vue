<template>
  <v-container>
    <v-row>
      <v-col>
        <SearchBar @update="onSearchUpdate"/>
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
          <v-row v-if="searchIndexesBuilding">
            <v-col>
              <h4>{{ messages.info_search_indexes_building.parseMessage({ indexes: searchIndexesBuilding.join(messages.locale_text_list_separator) })}}</h4>
            </v-col>
          </v-row>
          <v-row v-else-if="!searchResults || searchResults.length === 0">
            <v-col>
              <h2>
                {{ messages.info_search_no_results }}
              </h2>
            </v-col>
          </v-row>
          <v-row v-else>
            <div v-for="(obj, index) in searchResults" :key="index">
              <v-spacer />
              <v-col>
                <v-card
                  :min-height="minCardHeight"
                  :min-width="minCardWidth"
                  :max-height="maxCardHeight"
                  :max-width="maxCardWidth"
                >
                  <v-card-title>
                    <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: encPath(obj.path)}}">
                      {{ obj.name }}
                    </NuxtLink>
                  </v-card-title>
                  <v-card-text>
                    <NuxtLink :to="{path: '/media/'+obj.mediaType, query: {n: encPath(obj.path)}}">
                      <img
                        v-if="thumbnail(obj)"
                        :src="proxyUrl(thumbnail(obj))"
                        width="200"
                        height="200"
                        :alt="messages.thumbnail_alt_text.parseMessage({name: obj.name})"
                      >
                    </NuxtLink>
                  </v-card-text>
                </v-card>
              </v-col>
<!--              <v-spacer />-->
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

import SearchBar from '@/components/SearchBar'

import { proxyMediaUrl, splitSearchTerms } from '@/shared'
import { objectEncodePath } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ListObjects',
  components: { SearchBar },
  data () {
    return {
      searchTerms: '',
      offset: 0
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale', 'searching', 'searchResults', 'searchIndexesBuilding', 'searchError']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    minCardHeight () { return 200 },
    minCardWidth () { return 200 },
    maxCardHeight () { return 400 },
    maxCardWidth () { return 500 },
    query () {
      return {
        tags: splitSearchTerms(this.searchTerms),
        offset: this.offset
      }
    }
  },
  created () { this.runSearch() },
  methods: {
    ...mapActions(['searchContent']),
    thumbnail (obj) { return findThumbnail(obj) },
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) },
    runSearch () {
      const query = this.query
      this.searchContent({ query })
    },
    onSearchUpdate (update) {
      this.searchTerms = update
      this.runSearch()
    },
    encPath (path) { return objectEncodePath(path) }
  }
}
</script>
