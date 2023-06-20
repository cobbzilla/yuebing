<template>
  <v-container>
    <v-row>
      <v-col v-if="field.control !== 'hidden'">
        <div v-if="field.control === 'password'">
          *****
        </div>
        <div v-else-if="field.render === 'datetime'">
          {{ messages.label_date_and_time.parseDateMessage(value, messages) }}
        </div>
        <div v-else-if="field.control === 'flag'">
          <v-icon v-if="value">
            mdi-check
          </v-icon>
          <v-icon v-else>
            mdi-close
          </v-icon>
        </div>
        <div v-else-if="field.control === 'multi' && Array.isArray(value)">
          {{ value.join(messages['locale_text_list_separator']) }}
        </div>
        <div v-else>
          {{ value }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'

export default {
  name: 'OrmFieldDisplay',
  props: {
    field: { type: Object, required: true },
    value: { type: [String, Number, Boolean, Object, Array], default: () => null }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) }
  }
}
</script>
