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
    <div v-if="searchError && (searchError.toString().toLowerCase() !== 'forbidden') && (isPublic || user)" class="error">
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
      offsetField: null,
      noCacheField: false
    }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale', 'searching', 'searchError']),
    ...mapState('user', ['user']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    isPublic () { return this.publicConfig && this.publicConfig.public === true },
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
    })
    this.$watch('$route.query.o', (newOffset) => {
      if (typeof newOffset === 'undefined') {
        this.offsetField = this.$route.query.o || 0
      } else {
        this.offsetField = newOffset
      }
      if (this.searchField && this.searchField.trim().length > 0) {
        this.runSearch()
      }
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
        offset: this.offsetField || this.offset
      }
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
      this.$router.push({ path: this.$route.path, query })
      this.runSearch()
    }
  }
}
</script>
