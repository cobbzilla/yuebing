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
      <div v-if="session.loggedIn && session.user.email">
        <v-avatar size="48px" @click.stop="rightDrawer = session.loggedIn ? !rightDrawer : rightDrawer">
          <v-img :src="gravatarUrl(session.user)" contain :alt="`avatar image for ${session.user.firstName}`" />
        </v-avatar>
      </div>
      <div v-else>
        <v-btn icon @click.stop="rightDrawer = session.loggedIn ? !rightDrawer : rightDrawer">
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
              <h3>{{ localeIcon(item.value) }}</h3>
            </v-list-item>
          </template>
        </v-select>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="rightDrawer"
      :mini-variant="false"
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
          @click.stop="session.logout()"
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

const signUpUrl = '/signUp'
const signInUrl = '/signIn'
const allowRegistration = runtimeConfig.public.allowRegistration
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

const clipped = false
const rightDrawer = ref(true)
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
