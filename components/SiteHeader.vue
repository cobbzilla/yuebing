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
      <NuxtLink to="/login">Sign In</NuxtLink>
      <NuxtLink to="/register">Sign Up</NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SiteHeader',
  computed: {
    ...mapState('user.js', ['user', 'status']),
    accountName () {
      if (this.user) {
        if (this.user.firstName && this.user.firstName.trim().length > 0) {
          return this.user.firstName
        }
        if (this.user.username && this.user.username.trim().length > 0) {
          return this.user.username
        }
      }
      return 'mysterious one'
    }
  },
  methods: {
    ...mapActions('user.js', ['logout']),
    logOut () {
      console.log('calling account.logout...')
      this.logout()
    }
  }
}
</script>
