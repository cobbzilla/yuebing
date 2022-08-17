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
import { mapActions } from 'vuex'

export default {
  name: 'DefaultLayout',
  created () { this.fetchBrowserHeaders() },
  methods: {
    ...mapActions(['fetchBrowserHeaders'])
  }
}
</script>
