<template>
  <div>
    <h2>{{ messages.title_login }}</h2>
    <div>
      <ValidationObserver ref="form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <ValidationProvider v-slot="{ errors }" name="email" rules="required|email" immediate>
              <label for="email">{{ messages.label_email }}</label>
              <input v-model="email" type="text" name="email" class="form-control" :class="{ 'is-invalid': submitted && !email }" />
              <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('email', errors[0]) }}</span>
              <span v-if="loginError && loginErr.email" v-show="submitted" class="is-invalid">{{ fieldError('email', loginErr.email[0]) }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <ValidationProvider v-slot="{ errors }" name="password" rules="required" immediate>
              <label htmlFor="password">{{ messages.label_password }}</label>
              <input v-model="password" type="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
              <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('password', errors[0]) }}</span>
              <span v-if="loginError && loginErr.password" v-show="submitted" class="is-invalid">{{ fieldError('password', loginErr.password[0]) }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" :disabled="userStatus.loggingIn">
              {{ messages.button_login }}
            </button>
            <img v-show="userStatus.loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            <router-link to="/signUp" class="btn btn-link">
              {{ messages.button_register }}
            </router-link>
            <router-link to="/reset" class="btn btn-link">
              {{ messages.button_forgot_password }}
            </router-link>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
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
    messages () { return localeMessagesForUser(this.user) },
    loginErr () { return this.loginError || false }
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
