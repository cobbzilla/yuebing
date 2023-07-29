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

console.log(`default ===> START account=${JSON.stringify(account)}`);
if (!isSetup()) {
  console.log(`default ===> 2222 account=${JSON.stringify(account)}`);
  if (needsAdmin()) {
    console.log("default ===> /setup");
    navigateTo("/setup");
  } else if (!isSignIn()) {
    if (account.value.invalidSession) {
      console.log(`default ===> /signIn (invalid session!) account=${JSON.stringify(account)}`);
      navigateTo("/signIn");
    } else {
      if (hasSession() && !loggedIn()) {
        console.log(`default (refreshing.value = true) account=${JSON.stringify(account)}`);
        refreshingAccount.value = true;
        sessionStore.getAccount(route.path);
      } else if (isHome() && !loggedIn()) {
        if (!isSignIn()) {
          console.log("default ===> /signIn");
          navigateTo("/signIn");
        }
      }
    }
  }
}

watch(account, async (newAccount) => {
  console.log(`default.watch(account): starting with account=${JSON.stringify(newAccount)}`);
  if (refreshingAccount.value && newAccount && newAccount.session) {
    console.log(
      "default.watch(account): in refreshingAccount.value && account && account.session (refreshing.value = false)",
    );
    // refreshingAccount.value = false;
    if (!isHome()) {
      console.log("default.watch(account): ===> /home");
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
