<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_requestPasswordReset }}</h2>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <b>{{ messages.info_password_reset_email_error.parseMessage({ error: resetError }) }}</b>
        </v-snackbar>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" centered>
          <b>{{ messages.info_password_reset_email_sent.parseMessage({ email }) }}</b>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form v-if="!submitted">
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
              <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('email', errors) }}</span>
              <div v-show="submitted && !email" class="invalid-feedback">
                {{ requiredError('email') }}
              </div>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <v-btn class="btn btn-primary" :disabled="disableSendButton" @click.stop="handleSubmit">
              {{ messages.button_send_password_reset_email }}
            </v-btn>
          </div>
        </form>
      </v-col>
    </v-row>
    <v-row v-if="!userLoggedIn">
      <v-col>
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
        <v-btn class="btn btn-primary" to="/signIn" nuxt plain right>
          {{ messages.button_login }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="submitted" @click.stop="submitted = false">
          {{ messages.info_password_reset_try_again }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { publicConfigField } from '@/shared'
import { isValidEmail } from '@/shared/validation'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { UI_CONFIG } from '@/services/util'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'RequestPasswordReset',
  data () {
    return {
      email: '',
      submitted: false,
      errorSnackTimeout: -1,
      successSnackTimeout: -1,
      showErrorSnackbar: false,
      showSuccessSnackbar: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    resetSuccess () { return this.userStatus.passwordResetSuccess },
    resetError () { return this.userStatus.passwordResetRequestError },
    disableSendButton () {
      return this.userStatus.requestingPasswordReset || !isValidEmail(this.email)
    },
    allowRegistration () { return publicConfigField(this.publicConfig, this, 'allowRegistration') },
    userLoggedIn () { return this.user && this.userStatus && this.userStatus.loggedIn }
  },
  watch: {
    userStatus (newStat) {
      if (newStat) {
        if (newStat.passwordResetSuccess) {
          this.showSuccessSnackbar = true
          this.successSnackTimeout = UI_CONFIG.snackbarSuccessTimeout
          return
        } else if (newStat.passwordResetRequestError) {
          this.showErrorSnackbar = true
          this.errorSnackTimeout = UI_CONFIG.snackbarErrorTimeout
          return
        }
      }
      this.showSuccessSnackbar = false
      this.showErrorSnackbar = false
    }
  },
  methods: {
    ...mapActions('user', ['logout', 'requestPasswordReset']),
    handleSubmit () {
      this.submitted = true
      if (this.email) {
        const email = this.email
        this.requestPasswordReset({ email })
      }
    },
    requiredError (field) {
      return fieldErrorMessage(field, 'required', this.messages)
    },
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    }
  }
}
</script>
