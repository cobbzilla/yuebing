<template>
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
      <div v-if="status && status.verifyError">
        {{ verifyErrorMessage }}
      </div>
      <div v-else>
        <!-- should be unreachable... -->
        {{ messages.title_verifying_ended }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser, fieldErrorMessage } from '@/shared/locale'
import { VERIFY_EMAIL_PARAM, VERIFY_TOKEN_PARAM } from '@/shared/auth'

export default {
  name: 'VerifyUser',
  data () {
    return {
      error: null,
      verifying: true
    }
  },
  computed: {
    ...mapState('user', ['user', 'status']),
    messages () { return localeMessagesForUser(this.user) },
    verifyErrorMessage () {
      return this.status.verifyError && this.status.verifyError
        ? this.fieldError('token', this.status.verifyError)
        : JSON.stringify(this.status.verifyError)
    }
  },
  watch: {
    status (newStatus, oldStatus) {
      this.verifying = false
    }
  },
  created () {
    const email = this.$route.query[VERIFY_EMAIL_PARAM]
    if (typeof email !== 'string') {
      this.error = this.fieldError('email', 'required')
      return
    }
    const token = this.$route.query[VERIFY_TOKEN_PARAM]
    if (typeof token !== 'string') {
      this.error = fieldErrorMessage('token', 'required')
      return
    }
    this.verify({ email, token })
  },
  methods: {
    ...mapActions('user', ['verify']),
    fieldError (field, error) {
      return fieldErrorMessage(field, error, this.messages)
    }
  }
}
</script>
