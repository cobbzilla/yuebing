<template>
  <div>
    <!-- Reset password request -->
    <div v-if="resetPasswordHash">
      <h2>
        {{ messages.title_resetPassword }}
      </h2>
      <div v-if="tokenError">
        {{ tokenError }}
      </div>
      <div>
        <ValidationObserver ref="form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="password" :rules="passwordRules" immediate>
                <label htmlFor="password">{{ messages.label_newPassword }}</label>
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors.length>0 }"
                >
                <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('password', errors[0]) }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <button class="btn btn-primary" :disabled="userStatus.verifying">
                {{ messages.button_set_new_password }}
              </button>
              <img v-show="userStatus.verifying" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>

    <!-- Regular email account verification -->
    <div v-else>
      <div>
        <div v-if="verifying">
          <div v-if="error">
            <!-- Basic request error-->
            {{ error }}
          </div>
          <div v-else>
            <h2>
              {{ messages.title_verifying }}
            </h2>
          </div>
        </div>
        <div v-else>
          <div v-if="verifyErrorMessage" v-html="verifyErrorMessage" />
          <div v-else>
            <!-- should be unreachable... -->
            {{ messages.title_verifying_ended }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { VERIFY_EMAIL_PARAM, VERIFY_TOKEN_PARAM, VERIFY_RESET_PARAM, PASSWORD_RULES } from '@/shared/auth'

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
      verifying: true
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    messages () { return localeMessagesForUser(this.user) },
    passwordRules () { return PASSWORD_RULES },
    verifyErrorMessage () {
      if (!this.userStatus.verifyError) {
        return null
      }
      if (typeof this.userStatus.verifyError === 'object' &&
        Object.keys(this.userStatus.verifyError).length > 0) {
        let errors = ''
        Object.keys(this.userStatus.verifyError).forEach((field) => {
          const fieldErrors = this.userStatus.verifyError[field]
          for (const err of fieldErrors) {
            errors += this.fieldError(field, err) + '<br/>'
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
    userStatus (newStatus, oldStatus) {
      this.verifying = false
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
    async handleSubmit (e) {
      this.submitted = true
      const errors = await this.$refs.form.validate().then((success) => {
        if (success) {
          console.log('sending verify request off...')
          this.verify({
            email: this.email,
            token: this.token,
            resetPasswordHash: this.resetPasswordHash,
            password: this.password
          })
        }
      })
      console.log(`handleSubmit: received errors: ${JSON.stringify(errors)}`)
    }
  }
}
</script>
