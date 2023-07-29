<template>
  <v-app dark>
    <v-container>
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
import { useConfigStore } from "~/stores/config";
import { DEFAULT_META } from "~/utils/meta";
import { useSessionStore } from "~/stores/session";
import { isHome, isSetup, isSignIn } from "~/utils/config";
import { storeToRefs } from "pinia";

const configStore = useConfigStore();
const configRefs = storeToRefs(configStore);
await configStore.loadPublicConfig();
await configStore.loadBrowserHeaders();
const needsAdmin = () => configRefs.publicConfig?.value?.needsAdmin || false;

useSeoMeta({
  title: () => {
    return configRefs?.publicConfig?.value?.title || "⌛🥮";
  },
  ...DEFAULT_META,
});

const sessionStore = useSessionStore();
const sessionRefs = storeToRefs(sessionStore);

const loggedIn = () => sessionRefs.account?.value?.username && sessionRefs.account?.value?.session;
const hasSession = () => sessionRefs.account?.value?.session;
const refreshingAccount = ref(false);

if (!isSetup()) {
  if (needsAdmin()) {
    navigateTo("/setup");
  } else {
    if (hasSession() && !loggedIn()) {
      refreshingAccount.value = true;
      sessionStore.getAccount();
    } else if (isHome() && !loggedIn()) {
      if (!isSignIn()) navigateTo("/signIn");
    }
  }
}

watch(sessionRefs.account, (account) => {
  console.log(`default.watch(sessionRefs.account): starting with account=${JSON.stringify(account)}`);
  if (refreshingAccount.value && account && account.session) {
    console.log("default.watch(sessionRefs.account): in refreshingAccount.value && account && account.session");
    refreshingAccount.value = false;
    if (!isHome()) {
      console.log("default.watch(sessionRefs.account): ===> /home");
      navigateTo("/home");
    }
  }
});
</script>

<script lang="ts">
export default {
  head: {},
};
</script>
