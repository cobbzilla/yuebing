<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.admin_title_site_administration.parseMessage({ title }) }}</h2>
      </v-col>
    </v-row>
    <v-row v-for="(cat, catIndex) in siteConfigCategories" :key="catIndex">
      <v-col>
        <ConfigNode :options="{ config: siteConfig[cat], configLevel: 0, configPath: '', configLabel: 'admin_title_site_administration_'+cat }" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

import ConfigNode from '@/components/ConfigNode'

export default {
  name: 'SiteAdministration',
  components: { ConfigNode },
  data () {
    return {}
  },
  computed: {
    ...mapState('admin', ['siteConfig']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return this.$config.title },
    siteConfigCategories () { return this.siteConfig ? Object.keys(this.siteConfig) : null }
  },
  created () {
    this.loadSiteConfig()
  },
  methods: {
    ...mapActions('admin', ['loadSiteConfig', 'updateSiteConfig'])
  }
}
</script>
