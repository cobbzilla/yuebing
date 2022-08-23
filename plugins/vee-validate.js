import Vue from 'vue'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'

const valid = require('../shared/validation')

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

for (const [rule, validation] of Object.entries(rules)) {
  // noinspection TypeScriptValidateTypes
  extend(rule, Object.assign({}, { ...validation }, { message: rule }))
}

valid.extendVee()
