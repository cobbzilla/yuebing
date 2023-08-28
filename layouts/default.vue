<template>
  <v-app dark>
    <v-container v-if="initialized">
      <SiteHeader />
    </v-container>
    <v-main>
      <v-container fluid fill-height>
        <slot />
      </v-container>
    </v-main>
    <v-footer>
      <SiteFooter />
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useConfigStore } from "~/stores/configStore";
import { DEFAULT_META } from "~/utils/meta";
import { useSessionStore } from "~/stores/sessionStore";
import { isHome, isSetup, isSignIn } from "~/utils/config";

const configStore = useConfigStore();
const { publicConfig } = storeToRefs(configStore);
await configStore.loadPublicConfig();
await configStore.loadBrowserHeaders();
const needsAdmin = () => publicConfig.value?.needsAdmin || false;

useSeoMeta({
  title: () => {
    return publicConfig?.value?.title || "⌛🥮";
  },
  ...DEFAULT_META,
});

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);

const loggedIn = () => account.value?.username && account.value?.session;
const hasSession = () => account.value?.session;
const refreshingAccount = ref(false);

const initialized = ref(false);
const init = () => {
  if (!isSetup()) {
    if (needsAdmin()) {
      return navigateTo("/setup");
    } else if (!isSignIn()) {
      if (account.value.invalidSession) {
        return navigateTo("/signIn");
      } else if (hasSession() && !loggedIn()) {
        refreshingAccount.value = true;
        sessionStore.getAccount();
      } else if (isHome() && !loggedIn()) {
        if (!isSignIn()) {
          return navigateTo("/signIn");
        }
      }
    }
  }
  initialized.value = true;
};
init();

watch(account, (newAccount, oldAccount) => {
  if (
    refreshingAccount.value &&
    newAccount &&
    newAccount.session &&
    (!oldAccount || !oldAccount.session || oldAccount.session !== newAccount.session)
  ) {
    if (!isHome()) {
      // console.log("default.watch(account): ===> /home");
      return navigateTo("/home");
    }
  }
});
</script>

<script lang="ts">
export default {
  head: {},
};
</script>
