<template>
  <v-container>
    <v-row>
      <v-col>
        <SearchBar />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container fluid>
          <v-row v-if="searchIndexesBuilding">
            <v-col>
              <h4>{{ messages.info_search_indexes_building.parseMessage({ indexes: searchIndexesBuilding.join(messages.locale_text_list_separator) }) }}</h4>
            </v-col>
          </v-row>
          <v-row v-if="searching">
            <v-col>
              <h2>
                {{ messages.info_search_searching }}
              </h2>
            </v-col>
          </v-row>
          <v-row v-else-if="!searching && (!searchResults || searchResults.length === 0 || noQuery)">
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

import { proxyMediaUrl } from '@/shared'
import { objectEncodePath } from '@/shared/media'
import { findThumbnail } from '@/shared/mediainfo'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ListObjects',
  components: { SearchBar, VueWordCloud },
  data () {
    return {
      searchTerms: this.searchQuery && this.searchQuery.tags
        ? this.searchQuery.tags.join(' ')
        : '',
      noCache: this.searchQuery && this.searchQuery.noCache === true,
      offset: this.searchQuery && this.searchQuery.offset ? +this.searchQuery.offset : 0
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig', 'searchQuery', 'searching', 'searchResults', 'searchIndexesBuilding', 'searchError']),
    ...mapState('tags', ['tagWeights']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    unverifiedUserAndNotPublic () {
      return this.publicConfig && this.publicConfig.public === false &&
        this.user && this.user.email && this.userStatus && !this.user.verified
    },
    noQuery () {
      return typeof this.$route.query.s === 'undefined' || this.$route.query.s.length === 0
    }
  },
  created () {
    if (!this.tagWeights) {
      this.fetchTagWeights()
    }
  },
  methods: {
    ...mapActions('tags', ['fetchTagWeights']),
    thumbnail (obj) { return findThumbnail(obj) },
    proxyUrl (obj) { return proxyMediaUrl(obj, this.user, this.userStatus) },
    displayName (name) { return name ? name.replaceAll('_', ' ') : name },
    tagSearch (tag) {
      this.$router.push({ path: this.$route.path, query: { s: tag || '' } })
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
