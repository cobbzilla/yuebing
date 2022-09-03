<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_login }}</h2>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <ValidationObserver ref="form">
            <v-form id="form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <ValidationProvider v-slot="{ errors }" name="usernameOrEmail" rules="required" immediate>
                  <v-text-field
                    v-model="usernameOrEmail"
                    :label="messages.label_usernameOrEmail"
                    type="text"
                    name="usernameOrEmail"
                    class="form-control"
                    :error="submitted && errors.length>0"
                    :error-messages="submitted ? fieldError('usernameOrEmail', errors) || fieldError('email', errors) : null"
                  />
                </ValidationProvider>
              </div>
              <div class="form-group">
                <ValidationProvider v-slot="{ errors }" name="password" rules="required" immediate>
                  <v-text-field
                    v-model="password"
                    :label="messages.label_password"
                    type="password"
                    name="password"
                    class="form-control"
                    :error="submitted && errors.length>0"
                    :error-messages="submitted ? fieldError('password', errors) : null"
                    @keyup.enter="handleSubmit"
                  />
                </ValidationProvider>
              </div>
              <div class="form-group">
                <v-btn class="btn btn-primary" :disabled="loginDisabled" @click.stop="handleSubmit">
                  {{ messages.button_login }}
                </v-btn>
                <v-btn
                  v-if="allowRegistration"
                  class="btn btn-primary"
                  :to="signUpUrl"
                  nuxt
                  plain
                  right
                >
                  {{ messages.button_register }}
                </v-btn>
              </div>
            </v-form>
          </ValidationObserver>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <NuxtLink to="/reset" class="btn btn-link">
            {{ messages.button_forgot_password }}
          </NuxtLink>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { publicConfigField } from '@/shared'
import { REGISTER_ENDPOINT } from '@/shared/auth'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'

export default {
  name: 'UserLogin',
  data () {
    return {
      usernameOrEmail: '',
      password: '',
      submitted: false
    }
  },
  computed: {
    ...mapState('user', ['userStatus', 'loginError', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    signUpUrl () { return REGISTER_ENDPOINT },
    allowRegistration () { return publicConfigField(this, 'allowRegistration') },
    loginDisabled () { return this.userStatus.loggingIn || !this.usernameOrEmail || !this.password },
    loginErr () { return this.loginError || false }
  },
  watch: {
    loginError (newError) {
      if (newError) {
        if (newError.email) {
          if (newError.usernameOrEmail) {
            newError.usernameOrEmail.push(...newError.email)
          } else {
            newError.usernameOrEmail = newError.email
          }
          delete newError.email
        }
        if (newError.username) {
          if (newError.usernameOrEmail) {
            newError.usernameOrEmail.push(...newError.username)
          } else {
            newError.usernameOrEmail = newError.username
          }
          delete newError.username
        }
      }
      this.$refs.form.setErrors(newError || {})
    }
  },
  created () {
    // reset login status
    this.logout({ redirect: false })
  },
  methods: {
    ...mapActions('user', ['login', 'logout']),
    handleSubmit () {
      if (this.loginDisabled) { return }
      this.submitted = true
      const { usernameOrEmail, password } = this
      if (usernameOrEmail && password) {
        this.login({ usernameOrEmail, password })
      }
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    }
  }
}
</script>
