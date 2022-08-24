<template>
  <ValidationObserver ref="form">
    <form>
      <v-container>
        <v-row>
          <v-col>
            <h2>{{ messages.admin_title_site_administration.parseMessage({ title }) }}</h2>
          </v-col>
        </v-row>
        <v-row v-if="showSuccessSnackbar">
          <v-col>
            <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
              <h4>{{ messages.admin_info_config_updated }}</h4>
            </v-snackbar>
          </v-col>
        </v-row>
        <!-- todo: show/hide config JSON for category -->
        <v-row v-for="(cat, catIndex) in configCategories" :key="catIndex">
          <v-col>
            <ConfigNode
              :config="config[cat]"
              :config-level="0"
              :config-path="cat"
              :config-label="`admin_title_site_administration_${cat}`"
              @update="onConfigUpdate"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn class="btn btn-primary" :disabled="loadingSiteConfig || savingSiteConfig" @click.stop="updateConfig">
              {{ messages.admin_button_save_config }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </form>
  </ValidationObserver>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { publicConfigField } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'

import ConfigNode from '@/components/ConfigNode'
import { UI_CONFIG } from '@/services/util'

export default {
  name: 'SiteAdministration',
  components: { ConfigNode },
  data () {
    return {
      savingSiteConfig: false,
      config: null,
      showSuccessSnackbar: false,
      successSnackTimeout: -1
    }
  },
  computed: {
    ...mapState('admin', ['loadingSiteConfig', 'siteConfig', 'siteConfigError', 'updateSiteSuccess', 'siteConfigUpdateError']),
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    title () { return publicConfigField(this, 'title') },
    configCategories () { return this.config ? Object.keys(this.config) : null }
  },
  watch: {
    siteConfig (newConfig) {
      this.config = structuredClone(newConfig)
    },
    siteConfigUpdateError (newError) {
      console.log(`watch.siteConfigUpdateError: received newError=${JSON.stringify(newError)}`)
    },
    updateSiteSuccess (ok) {
      if (ok) {
        this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
        this.showSuccessSnackbar = true
      } else {
        this.successSnackTimeout = null
        this.showSuccessSnackbar = false
      }
    }
  },
  created () {
    this.loadSiteConfig()
  },
  methods: {
    ...mapActions('admin', ['loadSiteConfig', 'updateSiteConfig']),
    async updateConfig () {
      this.savingSiteConfig = true
      const errors = await this.$refs.form.validate()
        .then((success) => {
          if (success) { this.updateSiteConfig({ config: this.config }) }
        })
        .catch((err) => {
          console.log(`error calling updateSiteConfig: ${err} ${JSON.stringify(err)}`)
        })
        .finally(() => { this.savingSiteConfig = false })
      console.log(`OK -------- errors are ${JSON.stringify(errors)} and this.errors is ${this.errors}`)
    },
    onConfigUpdate (update) {
      // console.log(`onConfigUpdate(MAIN) received update: ${JSON.stringify(update)}`)
      const parts = update.field.split('_')
      const pathParts = parts.slice(0, parts.length - 1)
      const varname = parts.slice(-1)[0]
      let target = this.config
      for (const part of pathParts) {
        target = target[part]
        if (typeof target === 'undefined') {
          console.warn(`onConfigUpdate: invalid path: ${JSON.stringify(pathParts)} in update ${JSON.stringify(update)}`)
          return
        }
      }
      target[varname] = update.value
    }
  }
}
</script>
