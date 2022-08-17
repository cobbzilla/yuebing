<template>
  <v-container v-if="$config.emailEnabled">
    <v-row>
      <v-col>
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
              <form>
                <div class="form-group">
                  <ValidationProvider v-slot="{ errors }" name="password" rules="max:1000" immediate>
                    <v-text-field
                      v-model="emails"
                      :label="messages.label_friend_emails"
                      type="text"
                      name="emails"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors.length>0 }"
                    />
                    <span v-show="submitted && errors.length>0" class="is-invalid">{{ fieldError('emails', errors[0]) }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group">
                  <v-btn class="btn btn-primary" :disabled="userStatus.inviting" @click.stop="handleSubmit">
                    {{ messages.button_send_invitations }}
                  </v-btn>
                </div>
              </form>
            </ValidationObserver>
            <button @click.stop="showingInviteBlock = false">
              {{ messages.button_close_invite_friends.parseMessage({ title }) }}
            </button>
          </div>
        </div>
        <div v-else>
          <button @click="showInvite()">
            {{ messages.button_invite_friends.parseMessage({ title }) }}
          </button>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col>
        <h4>
          {{ messages.info_invite_friends_disabled_no_email.parseMessage({ title }) }}
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
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
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
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
    handleSubmit () {
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
