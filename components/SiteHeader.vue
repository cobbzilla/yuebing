<template>
  <div>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <NuxtLink to="/" style="text-decoration: none">
        <b><v-toolbar-title v-text="title" /></b>
      </NuxtLink>
      <v-spacer />
      <div v-if="user && user.email">
        <v-avatar size="48px" @click.stop="rightDrawer = !rightDrawer">
          <v-img :src="gravatarUrl" contain :alt="`avatar image for ${user.firstName}`" />
        </v-avatar>
      </div>
      <div v-else>
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </div>
      <div class="localeSelector">
        <v-select
          v-model="currentLocale"
          :items="supportedLocales"
          item-text="value"
          item-value="name"
          :value="currentLocale"
          dense
          @change="selectLocale"
        >
          <template #selection="{ item }"><h1 class="localeSelectorCurrentLocale">{{ localeIcon(item.name) }}</h1></template>
          <template #item="{ item }">
            <h1>
              {{ localeIcon(item.name) }}
            </h1>
            <span class="localeName">{{ item.value }}</span>
          </template>
        </v-select>
      </div>
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
          :to="signInUrl"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="messages.button_login" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="!loggedIn && allowRegistration"
          :to="signUpUrl"
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
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from '@/shared/auth'
import { localeMessagesForUser, localesList, localeEmoji, userLocale } from '@/shared/locale'
import { gravatarEmailUrl } from '@/shared/user'

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
      rightDrawer: false,
      currentLocale: null
    }
  },
  computed: {
    ...mapState('user', ['user', 'userStatus', 'anonLocale']),
    ...mapState(['browserLocale', 'publicConfig']),
    messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
    signInUrl () { return LOGIN_ENDPOINT },
    signUpUrl () { return REGISTER_ENDPOINT },
    gravatarUrl () { return this.user && this.user.email ? gravatarEmailUrl(this.user.email) : null },
    supportedLocales () { return localesList(this.user, this.browserLocale, this.anonLocale) },
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
  created () {
    this.currentLocale = userLocale(this.user, this.browserLocale, this.anonLocale)
  },
  methods: {
    ...mapActions('user', ['logout', 'setLocale']),
    logOut () {
      this.logout({ redirect: true })
    },
    localeIcon (locale) { return localeEmoji(locale) },
    selectLocale () {
      this.setLocale({ locale: this.currentLocale })
    }
  }
}
</script>

<style lang="scss" scoped>
.localeSelector {
  margin-top: 10px;
  margin-left: 20px;
  width: 70px;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: '';
}
.localeName {
  margin-left: 4px;
}
.localeSelectorCurrentLocale {
  text-align: right;
}
</style>
