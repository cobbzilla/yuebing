<template>
  <div>
    <div v-if="user && user.email && canEmail">
      <InviteFriends/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'
import InviteFriends from '@/components/InviteFriends.vue'

export default {
  name: 'SiteFooter',
  components: { InviteFriends },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
    canEmail () { return this.$config.emailEnabled }
  }
}
</script>
