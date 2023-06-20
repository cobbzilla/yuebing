<template>
  <v-container>
    <v-row v-if="tokenError">
      <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
        <b>{{ messages.info_verify_token_error.parseMessage({ error: tokenError }) }}</b>
      </v-snackbar>
    </v-row>
    <v-row v-if="resetPasswordHash">
      <v-container>
        <v-row>
          <v-col>
            <h2>
              {{ messages.title_resetPassword }}
            </h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <ValidationObserver ref="form">
              <v-form @submit.prevent="handleSubmit">
                <div class="form-group">
                  <ValidationProvider v-slot="{ errors }" name="password" :rules="formRules.password" immediate>
                    <v-text-field
                      v-model="password"
                      :label="messages.label_password"
                      type="password"
                      name="password"
                      class="form-control"
                      :error="submitted && errors.length>0"
                      :error-messages="submitted ? fieldError('password', errors) : null"
                    />
                  </ValidationProvider>
                </div>
              </v-form>
            </ValidationObserver>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="form-group">
              <v-btn class="btn btn-primary" :disabled="userStatus.verifying" @click.stop="handleSubmit">
                {{ messages.button_set_new_password }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-row>

    <!-- Regular email account verification -->
    <v-row v-else>
      <v-col>
        <div v-if="verifying">
          <div v-if="error">
            <v-snackbar v-model="showParamErrorSnackbar" :timeout="paramErrorSnackTimeout" color="error" centered>
              <b>{{ error }}</b>
            </v-snackbar>
          </div>
          <div v-else>
            <h2>
              {{ messages.title_verifying }}
            </h2>
          </div>
        </div>
        <div v-else>
          <div v-if="verifyErrorMessage">
            <b>{{ verifyErrorMessage }}</b>
          </div>
          <div v-else>
            <!-- should be unreachable... -->
            {{ messages.title_verifying_ended }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { empty } from '@/shared'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { VERIFY_EMAIL_PARAM, VERIFY_TOKEN_PARAM, VERIFY_RESET_PARAM } from '@/shared/auth'
import { condensedRules } from '@/shared/type/validation'
import { UI_CONFIG } from '@/services/util'

export default {
  name: 'VerifyUser',
  data () {
    return {
      email: null,
      token: null,
      resetPasswordHash: null,
      password: null,
      error: null,
      submitted: false,
      verifying: true,
      showErrorSnackbar: false,
      errorSnackTimeout: -1,
      showParamErrorSnackbar: false,
      paramErrorSnackTimeout: -1
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    formRules () { return condensedRules() },
    verifyErrorMessage () {
      if (!this.userStatus.verifyError) {
        return null
      }
      if (typeof this.userStatus.verifyError === 'object' && !empty(this.userStatus.verifyError)) {
        let errors = ''
        Object.keys(this.userStatus.verifyError).forEach((field) => {
          const fieldErrors = this.userStatus.verifyError[field]
          for (const err of fieldErrors) {
            errors += this.fieldError(field, err) + ', '
          }
        })
        return errors
      }
      return JSON.stringify(this.userStatus.verifyError)
    },
    tokenError () {
      if (!this.userStatus.verifyError) {
        return null
      }
      return Array.isArray(this.userStatus.verifyError.token)
        ? this.fieldError('token', this.userStatus.verifyError.token[0])
        : null
    }
  },
  watch: {
    userStatus (newStatus) {
      this.verifying = false
      if (newStatus) {
        if (newStatus.verifyError) {
          this.showErrorSnackbar = true
          this.errorSnackTimeout = UI_CONFIG.snackbarErrorTimeout
        }
      }
    }
  },
  created () {
    this.email = this.$route.query[VERIFY_EMAIL_PARAM]
    if (typeof this.email !== 'string') {
      this.error = this.fieldError('email', 'required')
      return
    }
    this.token = this.$route.query[VERIFY_TOKEN_PARAM]
    if (typeof this.token !== 'string') {
      this.error = fieldErrorMessage('token', 'required')
      return
    }
    this.resetPasswordHash = this.$route.query[VERIFY_RESET_PARAM] || null
    if (!this.resetPasswordHash) {
      this.verify({ email: this.email, token: this.token })
    } else {
      this.verifying = false
    }
  },
  methods: {
    ...mapActions('user', ['verify']),
    fieldError (field, error) {
      return fieldErrorMessage(field, error, this.messages)
    },
    async handleSubmit () {
      this.submitted = true
      await this.$refs.form.validate().then((success) => {
        if (success) {
          this.verify({
            email: this.email,
            token: this.token,
            resetPasswordHash: this.resetPasswordHash,
            password: this.password
          })
        }
      })
    }
  }
}
</script>
