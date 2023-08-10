<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_source_setup }}</h2>
        <b>
          {{ messages.title_source_setup_details }}
        </b>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <OrmForm
            v-if="srcTypeDef"
            form-name="setup_source_form"
            :type-def="srcTypeDef"
            type-name-message="typename_source"
            cancel-button-message=""
            :thing="sourceObject"
            :fields="srcTypeDef.tabIndexedFields()"
            :create="true"
            :read-only-object="() => false"
            :server-errors="createSourceServerErrors"
            :label-prefixes="['label_sourceType_', 'label_volumeType_']"
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
import { SourceType, SourceTypeDef } from "yuebing-model";
import { MobilettoOrmObject, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/sessionStore";
import { useConfigStore } from "~/stores/configStore";
import { useSourceStore } from "~/stores/model/sourceStore";

const configStore = useConfigStore();
const { publicConfig } = storeToRefs(configStore);
configStore.loadPublicConfig();
const srcTypeDef = SourceTypeDef.extend({
  typeName: SourceTypeDef.typeName,
  fields: {
    encryption: {
      fields: {
        encryptionAlgo: configCiphers(publicConfig.value),
      },
    },
  },
});

const sessionStore = useSessionStore();
const { localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const sourceStore = useSourceStore();
const { sourceList } = storeToRefs(sourceStore);
sourceStore.search();
watch(sourceList, (newSources) => {
  if (newSources && newSources.length > 0) {
    navigateTo("/admin/destination/admin");
  }
});

const sourceObject = ref({} as SourceType);
const createSourceServerErrors = ref({} as MobilettoOrmValidationErrors);

const onFormUpdated = (update: { field: string; value: any }) => {
  deepUpdate(sourceObject.value, update.field, update.value);
};

const onFormSubmitted = (src: MobilettoOrmObject) =>
  sourceStore
      .create(src as SourceType, createSourceServerErrors)
      .then(() => sourceStore.search());
</script>
