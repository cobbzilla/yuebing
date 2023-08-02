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
import { storeToRefs } from "pinia";
import { useConfigStore } from "~/stores/config";
import { DEFAULT_META } from "~/utils/meta";
import { useSessionStore } from "~/stores/session";
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
const route = useRoute();

if (!isSetup()) {
  if (needsAdmin()) {
    navigateTo("/setup");
  } else if (!isSignIn()) {
    if (account.value.invalidSession) {
      navigateTo("/signIn");
    } else if (hasSession() && !loggedIn()) {
        refreshingAccount.value = true;
        sessionStore.getAccount(route.path);
      } else if (isHome() && !loggedIn()) {
        if (!isSignIn()) {
          navigateTo("/signIn");
        }
    }
  }
}

watch(account, (newAccount, oldAccount) => {
  if (
    refreshingAccount.value &&
    newAccount &&
    newAccount.session &&
    (!oldAccount || !oldAccount.session || oldAccount.session !== newAccount.session)
  ) {
    if (!isHome()) {
      // console.log("default.watch(account): ===> /home");
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
