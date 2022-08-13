<template>
  <div>
    <h2>{{ messages.title_requestPasswordReset }}</h2>
    <div v-if="resetError">
      <b>{{ resetError }}</b>
    </div>
    <div v-if="resetSuccess">
      <b>{{ messages.info_password_reset_email_sent.parseMessage({ email }) }}</b>
    </div>
    <div v-if="submitted">
      <button @click="submitted = false">
        {{ messages.info_password_reset_try_again }}
      </button>
    </div>
    <form v-if="!submitted" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">{{ messages.label_email }}</label>
        <input v-model="email" type="text" name="email" class="form-control" :class="{ 'is-invalid': submitted && !email }" />
        <div v-show="submitted && !email" class="invalid-feedback">
          {{ requiredError('email') }}
        </div>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="disableSendButton">
          {{ messages.button_send_password_reset_email }}
        </button>
        <img v-show="userStatus.requestingPasswordReset" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        <router-link to="/signUp" class="btn btn-link">
          {{ messages.button_register }}
        </router-link>
        <router-link to="/signIn" class="btn btn-link">
          {{ messages.button_login }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { isValidEmail } from '@/shared/validation'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'

export default {
  name: 'RequestPasswordReset',
  data () {
    return {
      email: '',
      submitted: false
    }
  },
  computed: {
    ...mapState('user', ['userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    resetSuccess () { return this.userStatus.passwordResetRequested },
    resetError () { return this.userStatus.passwordResetRequestError },
    disableSendButton () {
      return this.userStatus.requestingPasswordReset || !isValidEmail(this.email)
    }
  },
  created () {
    // reset login status
    this.logout({ redirect: false })
  },
  methods: {
    ...mapActions('user', ['logout', 'requestPasswordReset']),
    handleSubmit (e) {
      this.submitted = true
      if (this.email) {
        const email = this.email
        this.requestPasswordReset({ email })
      }
    },
    requiredError (field) {
      return fieldErrorMessage(field, 'required', this.messages)
    }
  }
}
</script>
