<template>
  <div>
    <v-text-field
      v-model="search"
      :label="messages.label_search"
      type="text"
      name="search"
      class="form-control"
      @keyup.enter="$emit('update', search)"
    />
  </div>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'SearchBar',
  props: {
    search: { type: String, default: '' }
  },
  computed: {
    ...mapState(['publicConfig', 'browserLocale']),
    ...mapState('user', ['user']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) }
  }
}
</script>
