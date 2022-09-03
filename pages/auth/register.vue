<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_register }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="allowRegistration">
      <v-col>
        <ValidationObserver ref="form">
          <v-form id="form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="username" :rules="formRules.username" immediate>
                <v-text-field
                  v-model="user.username"
                  :label="messages.label_username"
                  type="text"
                  name="username"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('username', errors) : null"
                />
              </ValidationProvider>
            </div>

            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="firstName" :rules="formRules.firstName" immediate>
                <v-text-field
                  v-model="user.firstName"
                  :label="messages.label_firstName"
                  type="text"
                  name="firstName"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('firstName', errors) : null"
                />
              </ValidationProvider>
            </div>

            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="lastName" :rules="formRules.lastName" immediate>
                <v-text-field
                  v-model="user.lastName"
                  :label="messages.label_lastName"
                  type="text"
                  name="lastName"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('lastName', errors) : null"
                />
              </ValidationProvider>
            </div>

            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="email" :rules="formRules.email" immediate>
                <v-text-field
                  v-model="user.email"
                  :label="messages.label_email"
                  type="text"
                  name="email"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('email', errors) : null"
                />
              </ValidationProvider>
            </div>

            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="password" :rules="formRules.password" immediate>
                <v-text-field
                  v-model="user.password"
                  :label="messages.label_password"
                  type="password"
                  name="password"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('password', errors) : null"
                />
              </ValidationProvider>
            </div>

            <div v-if="supportedLocales.length > 1" class="form-group">
              <ValidationProvider v-slot="{ errors }" name="locale" rules="required" immediate>
                <v-select
                  v-model="user.locale"
                  :label="messages.label_locale"
                  :items="supportedLocales"
                  item-text="value"
                  item-value="name"
                  :value="userLocale"
                  class="form-control"
                  :error="submitted && errors.length>0"
                  :error-messages="submitted ? fieldError('locale', errors) : null"
                />
              </ValidationProvider>
            </div>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-row v-if="allowRegistration">
      <v-col>
        <div class="form-group">
          <v-btn class="btn btn-primary" :disabled="userStatus.registering || !user.email || !user.password" @click.stop="handleSubmit">
            {{ messages.button_register }}
          </v-btn>
        </div>
      </v-col>
      <v-col align-self="end">
        <NuxtLink :to="signInUrl" class="btn btn-link">
          {{ messages.button_login }}
        </NuxtLink>
      </v-col>
    </v-row>
    <v-row v-if="!allowRegistration">
      <v-col>
        <h4>{{ messages.info_registration_not_allowed.parseMessage({ title }) }}</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { publicConfigField } from '@/shared'
import { LOGIN_ENDPOINT } from '@/shared/auth'
import { DEFAULT_LOCALE, localesList, localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { condensedRules } from '@/shared/validation'

export default {
  name: 'UserRegistration',
  data () {
    return {
      user: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        locale: null
      },
      submitted: false
    }
  },
  computed: {
    ...mapState('user', ['userStatus', 'registerError', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig']),
    supportedLocales () { return localesList(this.user, this.browserLocale, this.anonLocale) },
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    signInUrl () { return LOGIN_ENDPOINT },
    allowRegistration () { return publicConfigField(this, 'allowRegistration') },
    formRules () { return condensedRules() },
    userLocale () {
      return this.user && this.user.locale
        ? this.user.locale
        : this.browserLocale
          ? this.browserLocale
          : DEFAULT_LOCALE
    },
    title () { return publicConfigField(this, 'title') }
  },
  watch: {
    browserLocale (newLocale) {
      if (newLocale && this.user.locale === null) {
        this.user.locale = newLocale
      }
    },
    registerError (newError) { this.$refs.form.setErrors(newError) }
  },
  created () {
    if (this.browserLocale) {
      this.user.locale = this.browserLocale
    } else {
      this.fetchBrowserHeaders()
    }
  },
  methods: {
    ...mapActions(['fetchBrowserHeaders']),
    ...mapActions('user', ['register']),
    async handleSubmit () {
      this.submitted = true
      await this.$refs.form.validate().then((success) => {
        if (success) {
          this.register(this.user)
        }
      })
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    }
  }
}
</script>
