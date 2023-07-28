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

const loggedIn = () => sessionRefs.user?.value?.username && sessionRefs.user?.value?.session;
const hasSession = () => sessionRefs.user?.value?.session;

if (!isSetup()) {
  if (needsAdmin()) {
    navigateTo("/setup");
  } else {
    if (hasSession() && !loggedIn()) {
      const account = await sessionStore.getAccount();
      if (account && account.session) {
        if (!isHome()) navigateTo("/home");
      }
    } else if (isHome() && !loggedIn()) {
      if (!isSignIn()) navigateTo("/signIn");
    }
  }
}
</script>

<script lang="ts">
export default {
  head: {},
};
</script>
