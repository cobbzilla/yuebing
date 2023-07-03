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
      <div v-if="session.user && session.user.email">
        <v-avatar size="48px" @click.stop="rightDrawer = !rightDrawer">
          <v-img :src="gravatarUrl(session.user)" contain :alt="`avatar image for ${session.user.firstName}`" />
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
          item-title="value"
          item-value="name"
          :value="currentLocale"
          dense
          @update:modelValue="selectLocale"
        >
          <template #selection="{ item }">
            <h1 class="localeSelectorCurrentLocale">{{ localeIcon(item.value) }}</h1>
          </template>
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <h1>{{ localeIcon(item.value) }}</h1>
            </v-list-item>
          </template>
        </v-select>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="rightDrawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      location="right"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-if="session.loggedIn"
          to="/profile"
          router
          exact
        >
          <v-list-item-title v-text="messages.button_profile" />
        </v-list-item>
        <v-list-item
          v-if="session.admin"
          to="/admin"
          router
          exact
        >
          <v-list-item-title v-text="messages.button_admin" />
        </v-list-item>
        <v-list-item
          v-if="session.loggedIn"
          @click.stop="logOut()"
        >
          <v-list-item-title v-text="messages.button_logout" />
        </v-list-item>
        <v-list-item
          v-if="!session.loggedIn"
          :to="signInUrl"
          router
          exact
        >
          <v-list-item-title v-text="messages.button_login" />
        </v-list-item>
        <v-list-item
          v-if="!session.loggedIn && allowRegistration"
          :to="signUpUrl"
          router
          exact
        >
          <v-list-item-title v-text="messages.button_register" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStore } from "~/stores/session"
import { localesList, localeEmoji } from '~/utils/locale'
import { gravatarUrl } from "~/utils/gravatar";

const session = useSessionStore()

const runtimeConfig = useRuntimeConfig()

const title = runtimeConfig.public.title

// TODO
const signUpUrl = '/signupURLok?'
const signInUrl = '/signinURLok?'
const allowRegistration = false
const supportedLocales = ref(localesList(session.user, session.browserLocale, session.anonLocale))
const messages = ref(session.localeMessages)
const currentLocale = ref(session.locale)
const selectLocale = (loc) => {
  currentLocale.value = loc
  session.setLocale(loc)
  messages.value = session.localeMessages
  supportedLocales.value = localesList(session.user, session.browserLocale, session.anonLocale)
}
const localeIcon = (loc) => localeEmoji(loc)
const logOut = () => {} // todo

let clipped = ref(false)
let drawer = ref(false)
let fixed = ref(false)
let miniVariant = ref(false)
let right = ref(true)
let rightDrawer = ref(false)
</script>

<script>
// noinspection NpmUsedModulesInstalled
// import { mapState, mapActions } from 'vuex'
// import { publicConfigField } from '@/shared'
// import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from '@/shared/auth'
// import { localeMessagesForUser, localesList, localeEmoji, userLocale } from '@/shared/locale'
// import { gravatarEmailUrl } from '@/shared/type/userType'

// noinspection JSUnusedGlobalSymbols
// export default {
//   name: 'SiteHeader',
//   data () {
//     return {
//       clipped: false,
//       drawer: false,
//       fixed: false,
//       miniVariant: false,
//       right: true,
//       rightDrawer: false,
//       currentLocale: null
//     }
//   },
//   computed: {
//     ...mapState('user', ['user', 'userStatus', 'anonLocale']),
//     ...mapState(['browserLocale', 'publicConfig']),
//     messages () { return localeMessagesForUser(this.user, this.browserLocale, this.anonLocale) },
//     signInUrl () { return LOGIN_ENDPOINT },
//     signUpUrl () { return REGISTER_ENDPOINT },
//     gravatarUrl () { return this.user && this.user.email ? gravatarEmailUrl(this.user.email) : null },
//     supportedLocales () { return localesList(this.user, this.browserLocale, this.anonLocale) },
//     accountName () {
//       if (this.user) {
//         if (this.user.firstName && this.user.firstName.trim().length > 0) {
//           return this.user.firstName
//         }
//         if (this.user.email && this.user.email.trim().length > 0) {
//           return this.user.email.includes('@')
//             ? this.user.email.substring(0, this.user.email.indexOf('@'))
//             : this.user.email
//         }
//       }
//       return this.messages && this.messages.anonymous_user_name
//         ? this.messages.anonymous_user_name
//         : 'mysterious one'
//     },
//     allowRegistration () { return publicConfigField(this, 'allowRegistration') },
//     title () { return publicConfigField(this, 'title') },
//     loggedIn () { return this.user && this.userStatus && this.userStatus.loggedIn },
//     admin () { return this.loggedIn && this.user.admin }
//   },
//   created () {
//     this.currentLocale = userLocale(this.user, this.browserLocale, this.anonLocale)
//   },
//   methods: {
//     ...mapActions('user', ['logout', 'setLocale']),
//     logOut () {
//       this.logout({ redirect: true })
//     },
//     localeIcon (locale) { return localeEmoji(locale) },
//     selectLocale () {
//       this.setLocale({ locale: this.currentLocale })
//     }
//   }
// }
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
