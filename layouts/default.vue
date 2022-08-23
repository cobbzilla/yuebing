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
  head () {
    return {
      title: this.publicConfig && this.publicConfig.title ? this.publicConfig.title : this.$config.title
    }
  },
  computed: {
    ...mapState(['publicConfig'])
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
