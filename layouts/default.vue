<template>
  <div>
    <SiteHeader/>
    <Nuxt />
    <SiteFooter/>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  name: 'DefaultLayout',
  created () { this.fetchBrowserHeaders() },
  methods: {
    ...mapActions(['fetchBrowserHeaders'])
  }
}
</script>
