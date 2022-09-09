<template>
  <v-container>
    <v-row>
      <v-col v-if="user && user.email && canEmail && inviteFriendsEnabled">
        <InviteFriends />
      </v-col>
      <v-spacer />
      <v-col v-if="messages.footer_credit">
        <div style="font-size: xx-small; text-align: right; position: absolute; bottom: 40px;" v-html="messages.footer_credit" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState } from 'vuex'
import { publicConfigField } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'
import InviteFriends from '@/components/InviteFriends.vue'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SiteFooter',
  components: { InviteFriends },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    canEmail () { return publicConfigField(this, 'emailEnabled') },
    inviteFriendsEnabled () { return publicConfigField(this, 'inviteFriendsEnabled') }
  }
}
</script>
