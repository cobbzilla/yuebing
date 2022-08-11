<template>
  <div>
    <div v-if="status">
      Your user status: {{ status }}
    </div>
    <div v-if="user">
      <h2>Welcome, {{ accountName }}</h2>
      <button @click="logOut">Sign Out</button>
    </div>
    <div v-else>
      <NuxtLink to="/signIn">Sign In</NuxtLink>
      <NuxtLink v-if="allowRegistration" to="/signUp">Sign Up</NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import config from '../nuxt.config'

export default {
  name: 'SiteHeader',
  computed: {
    ...mapState('user', ['user', 'status']),
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
