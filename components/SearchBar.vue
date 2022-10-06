<template>
  <div>
    <v-text-field
      v-model="searchField"
      :label="messages.label_search"
      :disabled="searching"
      type="text"
      name="search"
      class="form-control"
      @keyup.enter="search"
    />
    <v-checkbox
      v-if="user && user.admin === true"
      v-model="noCacheField"
      :label="messages.label_noCache"
    />
    <div v-if="searchError" class="error">
      {{ typeof searchError === 'object' ? JSON.stringify(searchError) : `${searchError}` }}
    </div>
  </div>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapActions, mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'
import { splitSearchTerms } from '@/shared'

export default {
  name: 'SearchBar',
  data () {
    return {
      searchField: '',
      noCacheField: false
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale', 'searching', 'searchError']),
    ...mapState('user', ['user']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    noCache () {
      return this.$route.query.c
        ? +this.$route.query.c
        : false
    },
    offset () {
      return this.$route.query.o
        ? +this.$route.query.o
        : 0
    }
  },
  created () {
    this.$watch('$route.query.s', (newSearch) => {
      if (typeof newSearch === 'undefined') {
        this.searchField = ''
      } else {
        this.searchField = newSearch
        this.runSearch()
      }
      console.log(`watch query.s: got newSearch=${newSearch}`)
    })
    this.searchField = typeof this.$route.query.s !== 'undefined' ? this.$route.query.s : this.searchField || ''
    this.noCacheField = (this.$route.query.c && (this.$route.query.c === true || this.$route.query.c === 'true')) || false
    this.runSearch()
  },
  methods: {
    ...mapActions(['searchContent']),
    runSearch () {
      const query = {
        tags: splitSearchTerms(this.searchField),
        noCache: this.noCacheField || this.noCache,
        offset: this.offset
      }
      console.log('>>> created: searching with query = ' + JSON.stringify(query))
      return this.searchContent({ query })
    },
    search () {
      const query = { s: this.searchField }
      if (this.noCacheField || this.noCache) {
        query.c = true
      }
      if (this.offset !== 0) {
        query.o = this.offset
      }
      console.log('>>> search: pushing query params = ' + JSON.stringify(query))
      this.$router.push({ path: this.$route.path, query })
      this.runSearch()
    }
  }
}
</script>
