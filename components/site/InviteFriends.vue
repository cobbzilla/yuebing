<template>
  <v-container v-if="emailEnabled && inviteFriendsEnabled">
    <v-row>
      <v-col>
        <div v-if="showingInviteBlock">
          <v-container>
            <v-row>
              <v-col>
                <v-btn icon @click.stop="showingInviteBlock = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <h2>
                  {{ messages.info_invite_friends_header.parseMessage({ title }) }}
                </h2>
                <h4>
                  {{ messages.info_invite_friends_subheader.parseMessage({ title }) }}
                </h4>
                <h3 v-if="limitRegistration">
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
                    <v-form @submit.prevent="handleSubmit">
                      <div class="form-group">
                        <ValidationProvider v-slot="{ errors }" name="password" rules="max:1000" immediate>
                          <v-text-field
                            v-model="emails"
                            :label="messages.label_friend_emails"
                            type="text"
                            name="emails"
                            class="form-control"
                            :error="submitted && errors.length>0"
                            :error-messages="submitted ? fieldError('emails', errors) : null"
                            @keyup.enter="handleSubmit"
                          />
                        </ValidationProvider>
                      </div>
                      <div class="form-group">
                        <v-btn class="btn btn-primary" :disabled="userStatus.inviting" @click.stop="handleSubmit">
                          {{ messages.button_send_invitations }}
                        </v-btn>
                      </div>
                    </v-form>
                  </ValidationObserver>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div v-else>
          <v-btn @click.stop="showInvite()">
            {{ messages.button_invite_friends.parseMessage({ title }) }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="!inviteFriendsEnabled">
    <v-row>
      <v-col>
        <h4>
          {{ messages.info_invite_friends_disabled_no_email.parseMessage({ title }) }}
        </h4>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col>
        <h4>
          {{ messages.info_invite_friends_disabled_no_email.parseMessage({ title }) }}
          emailEnabled = {{ emailEnabled }} && inviteFriendsEnabled = {{ inviteFriendsEnabled }}
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { okl, publicConfigField } from '@/shared'
import { fieldErrorMessage, localeMessagesForUser } from '@/shared/locale'
import { findValidEmails } from '@/shared/type/validation'

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
    ...mapState('user', ['user', 'userStatus', 'invitationResults', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    title () { return publicConfigField(this, 'title') },
    emailEnabled () { return publicConfigField(this, 'emailEnabled') },
    limitRegistration () { return publicConfigField(this, 'limitRegistration') },
    inviteFriendsEnabled () { return publicConfigField(this, 'inviteFriendsEnabled') },
    inviteSuccessCount () {
      return this.invitationResults.success ? okl(this.invitationResults.success) : 0
    },
    inviteErrorCount () {
      return this.invitationResults.errors ? okl(this.invitationResults.errors) : 0
    }
  },
  methods: {
    ...mapActions('user', ['inviteFriends', 'clearInvitationResults']),
    fieldError (field, error) {
      return field && error ? fieldErrorMessage(field, error, this.messages) : '(no message)'
    },
    handleSubmit () {
      this.submitted = true
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
