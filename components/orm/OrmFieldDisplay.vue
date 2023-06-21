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
          <div v-if="typeof (field.render) === 'function'">
            <v-icon v-if="renderField">
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-close
            </v-icon>
          </div>
          <div v-else>
            <v-icon v-if="value">
              mdi-check
            </v-icon>
            <v-icon v-else>
              mdi-close
            </v-icon>
          </div>
        </div>
        <div v-else-if="field.control === 'multi' && Array.isArray(value)">
          <div v-if="typeof (field.render) === 'function'">
            {{ renderField }}
          </div>
          <div v-else>
            {{ value.join(messages['locale_text_list_separator']) }}
          </div>
        </div>
        <div v-else>
          <div v-if="typeof (field.render) === 'function'">
            {{ renderField }}
          </div>
          <div v-else>
            {{ value }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'
import { publicConfigField } from '@/shared'

export default {
  name: 'OrmFieldDisplay',
  props: {
    field: { type: Object, required: true },
    value: { type: [String, Number, Boolean, Object, Array], default: () => null }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['publicConfig', 'browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    title () { return publicConfigField(this, 'title') },
    renderField () { return this.field.render(this.value, this.messages, this.title) }
  }
}
</script>
