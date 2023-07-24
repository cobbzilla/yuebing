<template>
  <v-container>
    <v-row>
      <v-col>
        <SearchBar />
      </v-col>
    </v-row>
    <v-row
      v-if="
        !searching &&
        !noSearchResults &&
        typeof searchResults.start === 'number' &&
        typeof searchResults.end === 'number' &&
        typeof searchResults.total === 'number'
      "
    >
      <v-col>
        <span style="font-size: x-small">
          {{
            messages.label_results_info.parseMessage({
              start: searchResults.start + 1,
              end: searchResults.end,
              total: searchResults.total,
            })
          }}
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-container fluid>
          <v-row v-if="searchIndexesBuilding">
            <v-col>
              <h4>
                {{
                  messages.info_search_indexes_building.parseMessage({
                    indexes: searchIndexesBuilding.join(messages.locale_text_list_separator),
                  })
                }}
              </h4>
            </v-col>
          </v-row>
          <v-row v-if="searching">
            <v-col>
              <h2>
                {{ messages.info_search_searching }}
              </h2>
            </v-col>
          </v-row>
          <v-row v-else-if="!searching && (noSearchResults || noQuery)">
            <v-col>
              <div v-if="unverifiedUserAndNotPublic">
                <h2>
                  {{
                    messages.info_search_no_results_unverified.parseMessage({
                      email: user.email,
                    })
                  }}
                </h2>
              </div>
              <div v-else-if="(isPublic || loggedIn) && tagWeights && tagWeights.length > 0">
                <vue-word-cloud
                  id="searchTagCloud"
                  :words="tagWeights"
                  color="WhiteSmoke"
                  font-family="Roboto, sans-serif"
                >
                  <template #default="{ word }">
                    <div style="cursor: pointer" @click="tagSearch(word[0])">
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
            <div v-if="hasPrev">
              <v-col>
                <v-card class="searchResultCard" @click.stop="prevPage">
                  <v-card-title>
                    <span>{{ messages.label_previous_page }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-btn icon>
                      <v-icon style="font-size: xxx-large; color: whitesmoke"> mdi-arrow-left </v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </div>
            <div v-for="(obj, index) in searchResults.objectList" :key="index">
              <v-spacer />
              <v-col>
                <NuxtLink
                  :to="{
                    path: '/media/' + obj.mediaType,
                    query: { n: encPath(obj.path) },
                  }"
                >
                  <v-card class="searchResultCard">
                    <v-card-title>
                      {{ displayName(obj.name) }}
                    </v-card-title>
                    <v-card-text>
                      <img
                        v-if="thumbnail(obj)"
                        :src="proxyUrl(thumbnail(obj))"
                        width="200"
                        :alt="
                          messages.thumbnail_alt_text.parseMessage({
                            name: displayName(obj.name),
                          })
                        "
                      />
                    </v-card-text>
                  </v-card>
                </NuxtLink>
              </v-col>
              <!-- <v-spacer />-->
            </div>
            <div v-if="hasNext">
              <v-col>
                <v-card class="searchResultCard" @click.stop="nextPage">
                  <v-card-title>
                    <span>{{ messages.label_next_page }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-btn icon>
                      <v-icon style="font-size: xxx-large; color: whitesmoke"> mdi-arrow-right </v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </div>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from "vuex";

import VueWordCloud from "vuewordcloud";
import SearchBar from "@/components/site/SearchBar";

import { proxyMediaUrl } from "utils/fuckall";
import { objectEncodePath } from "@/shared/media";
import { findThumbnail } from "@/shared/mediainfo";
import { localeMessagesForUser } from "@/shared/locale";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ListObjects",
  components: { SearchBar, VueWordCloud },
  data() {
    return {
      searchTerms: this.searchQuery && this.searchQuery.tags ? this.searchQuery.tags.join(" ") : "",
      noCache: this.searchQuery && this.searchQuery.noCache === true,
      offset: this.searchQuery && this.searchQuery.offset ? +this.searchQuery.offset : 0,
      pageSize: 20,
    };
  },
  computed: {
    ...mapState("user", ["user", "userStatus", "anonLocale"]),
    ...mapState([
      "browserLocale",
      "publicConfig",
      "searchQuery",
      "searching",
      "searchResults",
      "searchIndexesBuilding",
      "searchError",
    ]),
    ...mapState("tags", ["tagWeights"]),
    messages() {
      return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale);
    },
    isPublic() {
      return this.publicConfig && this.publicConfig.public === true;
    },
    unverifiedUserAndNotPublic() {
      return !this.isPublic && this.user && this.user.email && this.userStatus && !this.user.verified;
    },
    noQuery() {
      return typeof this.$route.query.s === "undefined" || this.$route.query.s.length === 0;
    },
    noSearchResults() {
      return !this.searchResults || !this.searchResults.objectList || this.searchResults.objectList.length === 0;
    },
    hasPrev() {
      return this.searchResults && this.searchResults.start && this.searchResults.start > 0;
    },
    hasNext() {
      return this.searchResults && this.searchResults.more;
    },
    loggedIn() {
      return this.user && this.userStatus && this.user.email;
    },
  },
  created() {
    if (!this.tagWeights) {
      this.fetchTagWeights();
    }
  },
  methods: {
    ...mapActions("tags", ["fetchTagWeights"]),
    ...mapActions(["searchContent"]),
    thumbnail(obj) {
      return findThumbnail(obj);
    },
    proxyUrl(obj) {
      return proxyMediaUrl(obj, this.user, this.userStatus);
    },
    displayName(name) {
      return name ? name.replaceAll("_", " ") : name;
    },
    tagSearch(tag) {
      this.$router.push({ path: this.$route.path, query: { s: tag || "" } });
    },
    prevPage() {
      const query = {
        s: this.$route.query.s || "",
        o:
          this.searchResults && this.searchResults.start > 0
            ? Math.max(0, this.searchResults.start - this.pageSize)
            : this.searchResults.start || 0,
      };
      this.$router.push({
        path: this.$route.path,
        query,
      });
      this.runSearch(query);
    },
    nextPage() {
      const query = {
        s: this.$route.query.s || "",
        o:
          this.searchResults && this.searchResults.more
            ? Math.min(this.searchResults.total, this.searchResults.start + this.pageSize)
            : this.pageSize,
      };
      this.$router.push({ path: this.$route.path, query });
      this.runSearch(query);
    },
    encPath(path) {
      return objectEncodePath(path);
    },
    runSearch(query) {
      return this.searchContent({ query });
    },
  },
};
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
