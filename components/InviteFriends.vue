<template>
  <div v-if="$config.emailEnabled">
    <div v-if="showingInviteBlock">
      <h2>
        {{ messages.info_invite_friends.parseMessage({ title }) }}
      </h2>
      <h3 v-if="$config.limitRegistration">
        {{ messages.info_invite_friends_limited_registration.parseMessage({ title }) }}
      </h3>
      <div v-if="invitationResults">
        <div v-if="inviteSuccessCount > 0">
          {{ messages.info_invitation_success_results.parseMessage({ successCount: inviteSuccessCount }) }}
        </div>
        <div v-if="inviteErrorCount > 0">
          {{ messages.info_invitation_error_results.parseMessage({ errorCount: inviteErrorCount }) }}
        </div>
      </div>
      <div>
        <ValidationObserver ref="form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" name="password" rules="max:1000" immediate>
                <label htmlFor="emails">{{ messages.label_friend_emails }}</label>
                <input
                  v-model="emails"
                  type="text"
                  name="emails"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors.length>0 }"
                >
                <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('emails', errors[0]) }}</span>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <button class="btn btn-primary" :disabled="userStatus.inviting">
                {{ messages.button_send_invitations }}
              </button>
              <img v-show="userStatus.inviting" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            </div>
          </form>
        </ValidationObserver>
        <button @click="showingInviteBlock = false">
          {{ messages.button_close_invite_friends.parseMessage({ title }) }}
        </button>
      </div>
    </div>
    <div v-else>
      <button @click="showInvite()">
        {{ messages.button_invite_friends.parseMessage({ title }) }}
      </button>
    </div>
  </div>
  <div v-else>
    {{ messages.info_invite_friends_disabled_no_email.parseMessage({ title }) }}
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { findValidEmails } from '@/shared/validation'

export default {
  name: 'InviteFriends',
  data () {
    return {
      emails: '',
      submitted: false,
      showingInviteBlock: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'invitationResults']),
    messages () { return localeMessagesForUser(this.user) },
    title () { return this.$config.title },
    inviteSuccessCount () {
      return this.invitationResults.success ? Object.keys(this.invitationResults.success).length : 0
    },
    inviteErrorCount () {
      return this.invitationResults.errors ? Object.keys(this.invitationResults.errors).length : 0
    }
  },
  methods: {
    ...mapActions('user', ['inviteFriends', 'clearInvitationResults']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    handleSubmit (e) {
      const emails = this.emails.trim()
      if (emails.length > 0) {
        this.inviteFriends({
          emails: findValidEmails(emails)
        })
        this.emails = ''
      }
    },
    showInvite () {
      this.showingInviteBlock = true
      this.emails = ''
      this.clearInvitationResults()
    }
  }
}
</script>
