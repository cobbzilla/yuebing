<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_library_setup }}</h2>
        <b>
          {{ messages.title_library_setup_details }}
        </b>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <OrmForm
            form-name="setup_library_form"
            :type-def="libType"
            type-name-message="typename_library"
            cancel-button-message=""
            :thing="libraryObject"
            :fields="libType.tabIndexedFields()"
            :create="true"
            :read-only-object="() => false"
            :server-errors="createLibraryServerErrors"
            :label-prefixes="['', 'label_']"
            @submitted="onFormSubmitted"
            @update="onFormUpdated"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { LibraryType, LibraryTypeDef } from "yuebing-model";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";
import { useLibraryStore } from "~/stores/model/libraryStore";
import { useSourceStore } from "~/stores/model/sourceStore";

const configStore = useConfigStore();
const { publicConfig } = storeToRefs(configStore);

const sessionStore = useSessionStore();
const { account, localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);

const sourceStore = useSourceStore();
const { sourceList } = storeToRefs(sourceStore);
sourceStore.sourceSearch();
watch(sourceList, (newSources) => {
  if (newSources && newSources.length === 0) {
    navigateTo("/admin/source/setup");
  }
});

const libType = LibraryTypeDef;
const libraryObject = ref({} as LibraryType);
const createLibraryServerErrors = ref({} as MobilettoOrmValidationErrors);

const onFormUpdated = (update: { field: string; value: any }) => {
  libraryObject.value[update.field] = update.value;
};

const onFormSubmitted = (lib: LibraryType) => libraryStore.libraryCreate(lib, createLibraryServerErrors);

watch(libraryList, (newList, oldList) => {
  if (newList && Array.isArray(newList)) {
    if ((!oldList && newList.length > 0) || (oldList.length && oldList.length < newList.length)) {
      navigateTo("/admin/account/setup");
    }
  }
});
</script>
