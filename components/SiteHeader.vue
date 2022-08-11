<template>
  <div>
<!--    <div v-if="status">-->
<!--      {{ status }}-->
<!--    </div>-->
    <div v-if="user">
      <h2>{{ messages.welcome.parseMessage(this, { user }) }}</h2>
      <button @click="logOut">{{ messages.button_logout }}</button>
    </div>
    <div v-else>
      <NuxtLink to="/signIn">{{ messages.button_login }}</NuxtLink>
      <NuxtLink v-if="allowRegistration" to="/signUp">{{ messages.button_register }}</NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { localeMessagesForUser } from '@/shared/locale'
import config from '../nuxt.config'

export default {
  name: 'SiteHeader',
  computed: {
    ...mapState('user', ['user', 'status']),
    messages () { return localeMessagesForUser(this.user) },
    accountName () {
      if (this.user) {
        if (this.user.firstName && this.user.firstName.trim().length > 0) {
          return this.user.firstName
        }
        if (this.user.email && this.user.email.trim().length > 0) {
          return this.user.email.includes('@')
            ? this.user.email.substring(0, this.user.email.indexOf('@'))
            : this.user.email
        }
      }
      return 'mysterious one'
    },
    allowRegistration () {
      return config.publicRuntimeConfig.allowRegistration
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    logOut () {
      console.log('calling account.logout...')
      this.logout()
    }
  }
}
</script>
