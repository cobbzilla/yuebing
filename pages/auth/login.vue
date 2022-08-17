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
            <form>
              <div class="form-group">
                <ValidationProvider v-slot="{ errors }" name="email" rules="required|email" immediate>
                  <v-text-field
                    v-model="email"
                    :label="messages.label_email"
                    type="text"
                    name="email"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !email }"
                  />
                  <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('email', errors[0]) }}</span>
                  <span v-if="loginErr && loginErr.email" v-show="submitted" class="is-invalid">{{ fieldError('email', loginErr.email[0]) }}</span>
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
                    :class="{ 'is-invalid': submitted && !password }"
                  />
                  <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('password', errors[0]) }}</span>
                  <span v-if="loginErr && loginErr.password" v-show="submitted" class="is-invalid">{{ fieldError('password', loginErr.password[0]) }}</span>
                </ValidationProvider>
              </div>
              <div class="form-group">
                <v-btn @click.stop="handleSubmit" class="btn btn-primary" :disabled="userStatus.loggingIn">
                  {{ messages.button_login }}
                </v-btn>
                <v-btn
                  v-if="allowRegistration"
                  class="btn btn-primary"
                  to="/signUp"
                  nuxt
                  plain
                  right
                >
                  {{ messages.button_register }}
                </v-btn>
              </div>
            </form>
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
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'

export default {
  name: 'UserLogin',
  data () {
    return {
      email: '',
      password: '',
      submitted: false
    }
  },
  computed: {
    ...mapState('user', ['userStatus', 'loginError']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    loginErr () { return this.loginError || false },
    allowRegistration () { return this.$config.allowRegistration }
  },
  created () {
    // reset login status
    this.logout({ redirect: false })
  },
  methods: {
    ...mapActions('user', ['login', 'logout']),
    handleSubmit (e) {
      this.submitted = true
      const { email, password } = this
      if (email && password) {
        this.login({ email, password })
      }
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    }
  }
}
</script>
