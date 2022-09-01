<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h3>{{ messages[configLabel] }}</h3>
        </v-col>
      </v-row>
      <v-row v-for="(cfg, cfgIndex) in configKeys" :key="cfgIndex">
        <div v-if="!ignoredField(cfg)">
          <v-col v-if="!hasSubConfig(cfg)">
            <ValidationProvider v-slot="{ errors }" :name="configFullName(cfg)" :rules="configRules(cfg)" immediate>
              <div v-if="isFlag(cfg)">
                <v-checkbox
                  v-model="configData[cfg]"
                  :label="messages[`admin_label_${configFullName(cfg)}`]"
                  :name="configFullName(cfg)"
                  class="form-control"
                  dense
                  :readonly="!isConfigurable(cfg)"
                  @change="$emit('update', {field: configFullName(cfg), value: configData[cfg]})"
                />
              </div>
              <div v-else-if="isDuration(cfg)">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="configData[cfg]"
                        type="text"
                        :name="configFullName(cfg)"
                        hidden
                      />
                      <DurationField
                        :field="cfg"
                        :field-value="configData[cfg]"
                        :field-rules="configRules(cfg)"
                        :field-label="`admin_label_${configFullName(cfg)}`"
                        @update="onConfigUpdate"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </div>
              <div v-else>
                <v-text-field
                  v-model="configData[cfg]"
                  :label="messages[`admin_label_${configFullName(cfg)}`]"
                  :type="cfg.toLowerCase().includes('password') ? 'password' : 'text'"
                  :name="configFullName(cfg)"
                  class="form-control"
                  dense
                  :readonly="!isConfigurable(cfg)"
                  :error="errors.length>0"
                  :error-messages="fieldError(configFullName(cfg), errors)"
                  @change="$emit('update', { field: configFullName(cfg), value: configData[cfg] })"
                />
                <small v-if="!isConfigurable(cfg)">{{ messages.hint_readonly }}</small>
              </div>
              <span v-show="errors.length>0" class="is-invalid">{{ fieldError(configFullName(cfg), errors) }}</span>
            </ValidationProvider>
          </v-col>
          <v-col v-else>
            <ConfigNode
              :config="configData[cfg]"
              :config-level="configLevel + 1"
              :config-path="nextConfigPath(cfg)"
              :config-label="`admin_label_${configFullName(cfg)}`"
              @update="onConfigUpdate"
            />
          </v-col>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import DurationField from '@/components/DurationField'

export default {
  name: 'ConfigNode',
  components: { DurationField },
  props: {
    config: { type: Object, default: null },
    configLevel: { type: Number, default: 0 },
    configPath: { type: String, default: '' },
    configLabel: { type: String, default: null }
  },
  data () {
    return {
      configData: {}
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    configKeys () { return this.config ? Object.keys(this.config) : null }
  },
  created () {
    // this.configData = Object.assign({}, this.config)
    this.configData = Object.assign({}, this.config)
    for (const f of Object.keys(this.configData)) {
      if (this.isFlag(f)) {
        this.configData[f] = (this.configData[f] === 'true' || this.configData[f] === true)
      }
    }
  },
  methods: {
    isConfigurable (field) {
      return this.config && this.config.configurable && this.config.configurable[field]
    },
    hasSubConfig (field) {
      return this.config && typeof this.config[field] === 'object' && this.config[field] !== null && !Array.isArray(this.config[field])
    },
    configFullName (field) {
      return this.configPath.length > 0 ? this.configPath + '_' + field : field
    },
    ignoredField (field) {
      if (field === 'configurable' || field === '_app') { return true }
      if (this.hasWhen(field)) {
        const when = this.configWhen(field)
        if (typeof this.configData[when] === 'undefined') {
          return true
        }
        const ctx = {}
        ctx[when] = this.configData[when]
        return `{{ ${when} }}`.parseMessage(ctx) !== 'true'
      }
      return false
    },
    isFlag (field) { return this.configFormat(field) === 'flag' },
    isDuration (field) { return this.configFormat(field) === 'duration' },
    configRules (field) {
      if (this.isConfigurable(field) && !this.isFlag(field) && this.config.configurable[field].rules) {
        return this.config.configurable[field].rules
      } else {
        // console.warn(`configRules: no rules found for configurable field: ${field}`)
        return ''
      }
    },
    configFormat (field) {
      if (this.isConfigurable(field) && this.config.configurable[field].format) {
        return this.config.configurable[field].format
      } else {
        return ''
      }
    },
    configWhen (field) {
      if (this.isConfigurable(field) && this.config.configurable[field].when) {
        return this.config.configurable[field].when
      } else {
        return ''
      }
    },
    hasWhen (field) { return this.configWhen(field) !== '' },
    nextConfigPath (field) {
      return this.configPath.length > 0 ? `${this.configPath}_${field}` : field
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages, 'admin_label_') : '(no message)'
    },
    onConfigUpdate (update) {
      // console.log(`onConfigUpdate(configPath=${this.configPath}}) received update: ${JSON.stringify(update)}`)
      this.$emit('update', this.configLevel === 0
        ? update
        : { field: this.configPath + '_' + update.field, value: update.value })
    }
  }
}
</script>
