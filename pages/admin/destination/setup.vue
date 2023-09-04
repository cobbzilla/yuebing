<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_destination_setup }}</h2>
        <b>
          {{ messages.title_destination_setup_details }}
        </b>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <OrmForm
            form-name="setup_destination_form"
            :type-def="destTypeDef"
            type-name-message="typename_destination"
            cancel-button-message=""
            :thing="destinationObject"
            :fields="destFields()"
            :create="true"
            :read-only-object="() => false"
            :server-errors="createDestinationServerErrors"
            :label-prefixes="['label_destinationType_', 'label_volumeType_']"
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
import { DestinationType, DestinationTypeDef } from "yuebing-model";
import {MobilettoOrmObject, MobilettoOrmValidationErrors} from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/sessionStore";
import { useConfigStore } from "~/stores/configStore";
import { useDestinationStore } from "~/stores/model/destinationStore";

const configStore = useConfigStore();
const { publicConfig } = storeToRefs(configStore);
configStore.loadPublicConfig();
const destTypeDef = DestinationTypeDef.extend({
  typeName: DestinationTypeDef.typeName,
  fields: {
    encryption: {
      fields: {
        encryptionAlgo: configCiphers(publicConfig.value),
      },
    },
    system: {
      control: "hidden",
      default: true,
    },
    assets: {
      control: "hidden",
      default: true,
    },
  },
});
const destFields = () => destTypeDef.tabIndexedFields().filter((f) => f.name !== "system");

const sessionStore = useSessionStore();
const { localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const destinationStore = useDestinationStore();
const { destinationList } = storeToRefs(destinationStore);
destinationStore.search();
watch(destinationList, (newDestinations) => {
  if (newDestinations && newDestinations.length > 0) {
    navigateTo("/admin/library/setup");
  }
});

const destinationObject = ref({} as DestinationType);
const createDestinationServerErrors = ref({} as MobilettoOrmValidationErrors);

const onFormUpdated = (update: { field: string; value: any }) => {
  deepUpdate(destinationObject.value, update.field, update.value);
};

const onFormSubmitted = (dest: MobilettoOrmObject) => {
  dest.system = true;
  return destinationStore
    .create(dest as DestinationType, createDestinationServerErrors)
    .then(() => destinationStore.search());
};
</script>
