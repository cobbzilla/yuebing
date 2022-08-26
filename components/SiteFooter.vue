<template>
  <div>
    <div v-if="user && user.email && canEmail && inviteFriendsEnabled">
      <InviteFriends />
    </div>
  </div>
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
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    canEmail () { return publicConfigField(this, 'emailEnabled') },
    inviteFriendsEnabled () { return publicConfigField(this, 'inviteFriendsEnabled') }
  }
}
</script>
