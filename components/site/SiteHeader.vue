<template>
  <div>
    <v-app-bar :clipped-left="clipped" fixed app>
      <NuxtLink to="/" style="text-decoration: none">
        <b><v-toolbar-title :text="title()" /></b>
      </NuxtLink>
      <v-spacer />
      <div
        v-if="
          loggedIn() &&
          sessionStore.account.email &&
          sessionStore.account.firstName &&
          gravatarUrl(sessionStore.account)
        "
      >
        <v-avatar size="48px" @click.stop="rightDrawer = loggedIn() ? !rightDrawer : rightDrawer">
          <v-img
            :src="gravatarUrl(sessionStore.account) || undefined"
            contain
            :alt="`avatar image for ${sessionStore.account.firstName}`"
          />
        </v-avatar>
      </div>
      <div v-else>
        <v-btn icon @click.stop="rightDrawer = loggedIn() ? !rightDrawer : rightDrawer">
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
          @update:model-value="selectLocale"
        >
          <template #selection="{ item }">
            <h1 class="localeSelectorCurrentLocale">
              {{ localeIcon(item.value) }}
            </h1>
          </template>
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <h3>{{ localeIcon(item.value) }}</h3>
            </v-list-item>
          </template>
        </v-select>
      </div>
      <!--      <div>-->
      <!--        <small>-->
      <!--          DEBUG SECTION:<br />-->
      <!--          [[ showNav() == {{ showNav() }} ]] [[ loggedIn() == {{ loggedIn() }} ]] [[ sessionStore.account ==-->
      <!--          {{ JSON.stringify(sessionStore.account || "null") }} ]] [[ sessionRefs.account ==-->
      <!--          {{ JSON.stringify(sessionRefs.account || "null") }} ]] [[ sessionStore.admin == {{ sessionStore.admin }} ]] [[-->
      <!--          sessionRefs.admin == {{ sessionRefs.admin }} ]]-->
      <!--        </small>-->
      <!--      </div>-->
    </v-app-bar>

    <v-navigation-drawer
      v-if="showNav()"
      v-model="rightDrawer"
      :mini-variant="false"
      :clipped="clipped"
      location="right"
      fixed
      app
    >
      <v-list>
        <v-list-item v-if="loggedIn()" to="/profile" router exact :title="messages?.button_profile" />
        <v-list-item v-if="sessionRefs.admin.value" to="/admin" router exact :title="messages?.button_admin" />
        <v-list-item v-if="loggedIn()" @click.stop="sessionStore.logout()" :title="messages?.button_logout" />
        <v-list-item v-if="!loggedIn()" :to="signInUrl" router exact :title="messages?.button_login" />
        <v-list-item
          v-if="!loggedIn() && regEnabled()"
          :to="signUpUrl"
          router
          exact
          :title="messages?.button_register"
        />
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { localesList, localeEmoji } from "yuebing-messages";
import { useConfigStore } from "~/stores/config";
import { useSessionStore } from "~/stores/session";
import { gravatarUrl } from "~/utils/gravatar";
import { storeToRefs } from "pinia";
import { configRegistrationEnabled, configTitle } from "~/utils/config";

const configStore = useConfigStore();
const configRefs = storeToRefs(configStore);
await configStore.loadPublicConfig();

const title = configTitle;
const regEnabled = configRegistrationEnabled;

const signUpUrl = "/signUp";
const signInUrl = "/signIn";

const sessionStore = useSessionStore();
const sessionRefs = storeToRefs(sessionStore);

const loggedIn = () => sessionRefs.account?.value?.username && sessionRefs.account?.value?.session;

const supportedLocales = ref(
  localesList(sessionRefs.account.value, sessionRefs.browserLocale.value, sessionRefs.anonLocale.value),
);

const messages = ref(sessionStore.localeMessages);
const currentLocale = sessionRefs.currentLocale;
const selectLocale = (loc: string) => {
  currentLocale.value = loc;
  sessionStore.setLocale(loc);
  messages.value = sessionStore.localeMessages;
  supportedLocales.value = localesList(
    sessionRefs.account.value,
    sessionRefs.browserLocale.value,
    sessionRefs.anonLocale.value,
  );
};
const localeIcon = (loc: string) => localeEmoji(loc);
const showNav = () => !configRefs.publicConfig?.value?.needsAdmin;

const clipped = false;
const rightDrawer = ref(true);
</script>

<style lang="scss" scoped>
.localeSelector {
  margin-top: 10px;
  margin-left: 20px;
  width: 70px;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-indent: 1px;
  text-overflow: "";
}
.localeName {
  margin-left: 4px;
}
.localeSelectorCurrentLocale {
  text-align: right;
}
</style>
