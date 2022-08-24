<template>
  <div>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <NuxtLink to="/" style="text-decoration: none">
        <v-toolbar-title v-text="title" />
      </NuxtLink>
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="rightDrawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      right
      app
    >
      <v-list>
        <v-list-item
          v-if="loggedIn"
          to="/profile"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="messages.button_profile" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="admin"
          to="/admin"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="messages.button_admin" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="loggedIn"
          @click.stop="logOut()"
        >
          <v-list-item-content>
            <v-list-item-title v-text="messages.button_logout" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="!loggedIn"
          to="/signIn"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="messages.button_login" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="!loggedIn && allowRegistration"
          to="/signUp"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="messages.button_register" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// noinspection NpmUsedModulesInstalled
import { mapState, mapActions } from 'vuex'
import { publicConfigField } from '@/shared'
import { localeMessagesForUser } from '@/shared/locale'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SiteHeader',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale) },
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
      return this.messages && this.messages.anonymous_user_name
        ? this.messages.anonymous_user_name
        : 'mysterious one'
    },
    allowRegistration () { return publicConfigField(this, 'allowRegistration') },
    title () { return publicConfigField(this, 'title') },
    loggedIn () { return this.user && this.userStatus && this.userStatus.loggedIn },
    admin () { return this.loggedIn && this.user.admin }
  },
  methods: {
    ...mapActions('user', ['logout']),
    logOut () {
      this.logout({ redirect: true })
    }
  }
}
</script>
