<template>
  <div>
    <ValidationObserver ref="form">
      <form>
        <v-container>
          <v-row>
            <v-col>
              <h3>{{ messages[options.configLabel] }}</h3>
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
                      :readonly="!isConfigurable(cfg)"
                    />
                  </div>
                  <div v-else-if="isDuration(cfg)">
                    <v-container>
                      <v-row>
                        <v-col>
                          <DurationField :options="{
                            field: cfg,
                            fieldValue: configData[cfg],
                            fieldRules: configRules(cfg),
                            fieldLabel: `admin_label_${configFullName(cfg)}`
                          }"
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
                      :readonly="!isConfigurable(cfg)"
                    />
                    <small v-if="!isConfigurable(cfg)">{{ messages.hint_readonly }}</small>
                  </div>
                  <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError(configFullName(cfg), errors[0]) }}</span>
                </ValidationProvider>
              </v-col>
              <v-col v-else>
                <ConfigNode
                  :options="{
                    config: configData[cfg],
                    configLevel: options.configLevel + 1,
                    configPath: nextConfigPath(cfg),
                    configLabel: `admin_label_${configFullName(cfg)}`
                  }"
                />
              </v-col>
            </div>
          </v-row>
        </v-container>
      </form>
    </ValidationObserver>
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
    options: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      submitted: false,
      configData: {}
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    configKeys () { return this.options && this.options.config ? Object.keys(this.options.config) : null }
  },
  created () {
    this.configData = Object.assign({}, this.options.config)
    for (const f of Object.keys(this.configData)) {
      if (this.isFlag(f)) {
        this.configData[f] = (this.configData[f] === 'true' || this.configData[f] === true)
      }
    }
  },
  methods: {
    isConfigurable (field) {
      return this.options && this.options.config && this.options.config.configurable && this.options.config.configurable[field]
    },
    hasSubConfig (field) {
      return this.options && this.options.config && typeof this.options.config[field] === 'object' && !Array.isArray(this.options.config[field])
    },
    configFullName (field) {
      return this.options.configPath.length > 0 ? this.options.configPath + '_' + field : field
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
      if (this.isConfigurable(field) && !this.isFlag(field) && this.options.config.configurable[field].rules) {
        return this.options.config.configurable[field].rules
      } else {
        // console.warn(`configRules: no rules found for configurable field: ${field}`)
        return ''
      }
    },
    configFormat (field) {
      if (this.isConfigurable(field) && this.options.config.configurable[field].format) {
        return this.options.config.configurable[field].format
      } else {
        return ''
      }
    },
    configWhen (field) {
      if (this.isConfigurable(field) && this.options.config.configurable[field].when) {
        return this.options.config.configurable[field].when
      } else {
        return ''
      }
    },
    hasWhen (field) { return this.configWhen(field) !== '' },
    nextConfigPath (field) {
      return this.options.configPath.length > 0 ? `${this.options.configPath}_${field}` : field
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages, 'admin_label_') : '(no message)'
    }
  }
}
</script>
