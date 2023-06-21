<template>
  <v-container>
    <v-row>
      <v-col v-if="field.control !== 'hidden'">
        <div v-if="field.control === 'password'">
          <div v-if="label">
            <v-text-field value="******" disabled readonly />
          </div>
          <div v-else>
            ******
          </div>
        </div>
        <div v-else-if="field.render === 'datetime'">
          <div v-if="label">
            <v-text-field :value="messages.label_date_and_time.parseDateMessage(value, messages)" disabled readonly />
          </div>
          <div v-else>
            {{ messages.label_date_and_time.parseDateMessage(value, messages) }}
          </div>
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
            <div v-if="label">
              <v-text-field :value="renderField" disabled readonly />
            </div>
            <div v-else>
              {{ renderField }}
            </div>
          </div>
          <div v-else>
            <div v-if="label">
              <v-text-field :value="value.join(messages['locale_text_list_separator'])" disabled readonly />
            </div>
            <div v-else>
              {{ value.join(messages['locale_text_list_separator']) }}
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="typeof (field.render) === 'function'">
            <div v-if="label">
              <v-text-field :value="renderField" disabled readonly />
            </div>
            <div v-else>
              {{ renderField }}
            </div>
          </div>
          <div v-else>
            <div v-if="label">
              <v-text-field :value="value" disabled readonly />
            </div>
            <div v-else>
              {{ value }}
            </div>
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
    value: { type: [String, Number, Boolean, Object, Array], default: () => null },
    label: { type: Boolean, default: () => false }
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
