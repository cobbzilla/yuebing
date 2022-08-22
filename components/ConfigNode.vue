<template>
  <div>
    config node, got options= {{ JSON.stringify(options) }}
  </div>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'ConfigNode',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) }
  }
}
</script>
