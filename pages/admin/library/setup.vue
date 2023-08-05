<template>
  <v-container>
    <v-row>
      <v-col>
        <!--suppress TypeScriptUnresolvedReference -->
        <h2>{{ messages.title_library_setup }}</h2>
        <!--suppress TypeScriptUnresolvedReference -->
        <b>
          {{ messages.title_library_setup_details }}
        </b>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <OrmForm
            v-if="sourcesLoaded && destinationsLoaded && libTypeDef"
            form-name="setup_library_form"
            :type-def="libTypeDef"
            type-name-message="typename_library"
            cancel-button-message=""
            :thing="libraryObject"
            :fields="libTypeDefFields"
            :create="true"
            :read-only-object="() => false"
            :server-errors="createLibraryServerErrors"
            :label-prefixes="['admin_label_library_', 'label_media_', 'label_']"
            :hint-suffixes="['_description']"
            @submitted="onFormSubmitted"
            @update="onFormUpdated"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { storeToRefs } from "pinia";
import { LibraryType, LibraryTypeDef } from "yuebing-model";
import {
  MobilettoOrmFieldDefConfig,
  MobilettoOrmObject,
  MobilettoOrmTypeDef,
  MobilettoOrmValidationErrors,
} from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";
import { useLibraryStore } from "~/stores/model/libraryStore";
import { useSourceStore } from "~/stores/model/sourceStore";
import { useDestinationStore } from "~/stores/model/destinationStore";

const sessionStore = useSessionStore();
const { localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);

const libTypeDef: Ref<MobilettoOrmTypeDef | null> = ref(null);
const libTypeDefFields: Ref<MobilettoOrmFieldDefConfig[] | undefined> = ref(undefined);

const typeDefSources = ref({} as MobilettoOrmFieldDefConfig);
const sourcesLoaded = ref(false);
const typeDefDestinations = ref({} as MobilettoOrmFieldDefConfig);
const destinationsLoaded = ref(false);

const libraryObject = ref({} as LibraryType);
const createLibraryServerErrors = ref({} as MobilettoOrmValidationErrors);

const sourceStore = useSourceStore();
const { sourceList } = storeToRefs(sourceStore);

const destinationStore = useDestinationStore();
const { destinationList } = storeToRefs(destinationStore);

const initLibTypeDef = () => {
  const typeDef = LibraryTypeDef.extend({
    fields: {
      sources: { ...typeDefSources.value, control: "hidden" },
      destinations: { ...typeDefDestinations.value, control: "hidden" }
    }
  });
  libTypeDefFields.value = typeDef.tabIndexedFields();
  libTypeDef.value = typeDef;
}

watch(sourceList, (newSources) => {
  if (newSources && newSources.length === 0) {
    navigateTo("/admin/source/setup");
  } else if (newSources && newSources.length > 0) {
    typeDefSources.value.values = libraryObject.value.sources = newSources.map((s) => s.name);
    typeDefSources.value.labels = newSources.map((s) => s.name);
    typeDefSources.value.items = newSources.map((s) => ({
      label: s.name,
      value: s.name,
      title: s.name,
      rawLabel: true,
    }));
    sourcesLoaded.value = true;
    if (destinationsLoaded.value) {
      initLibTypeDef()
    }
  }
});

watch(destinationList, (newDestinations) => {
  if (newDestinations && newDestinations.length === 0) {
    navigateTo("/admin/source/setup"); // source will navigateTo destination/setup if needed
  } else if (newDestinations && newDestinations.length > 0) {
    typeDefDestinations.value.values = libraryObject.value.destinations = newDestinations.map((s) => s.name);
    typeDefDestinations.value.items = newDestinations.map((s) => ({
      label: s.name,
      value: s.name,
      title: s.name,
      rawLabel: true,
    }));
    destinationsLoaded.value = true;
    if (sourcesLoaded.value) {
      initLibTypeDef()
    }
  }
});

const onFormUpdated = (update: { field: string; value: any }) => {
  libraryObject.value[update.field] = update.value;
};

const onFormSubmitted = (lib: MobilettoOrmObject) => {
  lib.sources = typeDefSources.value.values
  lib.destinations = typeDefDestinations.value.values
  return libraryStore
    .libraryCreate(lib as LibraryType, createLibraryServerErrors)
    .then(() => libraryStore.librarySearch());
}

watch(libraryList, (newList, oldList) => {
  if (newList && Array.isArray(newList)) {
    if ((!oldList && newList.length > 0) || (oldList && oldList.length && oldList.length < newList.length)) {
      navigateTo("/admin/account/setup");
    }
  }
});

libraryStore.librarySearch().then((libs) => {
  if (libs.length === 0) {
    sourceStore.search();
    destinationStore.search();
  }
});
</script>
