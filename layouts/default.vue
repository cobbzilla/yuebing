<template>
  <v-app dark>
    <v-container>
      <SiteHeader />
    </v-container>
    <v-main>
      <v-container fluid fill-height>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <SiteFooter />
    </v-footer>
  </v-app>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['publicConfig', 'browserHeaders'])
  },
  watch: {
    publicConfig (newConfig) {
      if (newConfig && newConfig.title) {
        document.title = newConfig.title
      }
    }
  },
  created () {
    this.fetchBrowserHeaders()
    this.loadPublicConfig()
  },
  methods: {
    ...mapActions(['fetchBrowserHeaders', 'loadPublicConfig'])
  }
}
</script>
