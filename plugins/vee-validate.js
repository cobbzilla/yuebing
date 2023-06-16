import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

require('../shared/model/validation')

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
