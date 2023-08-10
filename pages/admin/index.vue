<template>
  <v-container v-if="hasLibraries">
    <v-row>
      <v-col><h3>{{ adminTitle() }}</h3></v-col>
    </v-row>
    <v-row v-for="(typeDefName, idx) in ['account','source','destination','library','publicConfig','privateConfig']" :key="idx">
      <v-col>
        <NuxtLink :to="`/admin/${typeDefName}/admin`" style="text-decoration: none">
          <b>{{ messages[`admin_title_${typeDefName}_administration`] }}</b>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row>
      <v-col>
        <Icon name="material-symbols:clock-outline" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { parseMessage } from "hokey-runtime";
import { configTitle } from "~/utils/config";
import { useLibraryStore } from "~/stores/model/libraryStore";
import { useSessionStore } from "~/stores/sessionStore";

const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);
libraryStore.search();

const sessionStore = useSessionStore();
const { localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const title = configTitle;
const adminTitle = () => parseMessage(messages.value.admin_title_site_administration, messages.value, { title: title() })

const hasLibraries = ref(false);

watch(libraryList, (libraries) => {
  if (libraries && libraries.length === 0) {
    navigateTo("/admin/source/admin");
  } else if (libraries && libraries.length > 0) {
    hasLibraries.value = true;
  }
});
</script>
