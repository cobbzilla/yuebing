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
            :type-def="DestinationTypeDef"
            type-name-message="typename_destination"
            cancel-button-message=""
            :thing="destinationObject"
            :fields="DestinationTypeDef.tabIndexedFields()"
            :create="true"
            :read-only-object="() => false"
            :server-errors="createDestinationServerErrors"
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
import { DestinationType, DestinationTypeDef } from "yuebing-model";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";
import { useDestinationStore } from "~/stores/model/destinationStore";

const configStore = useConfigStore();
const { publicConfig } = storeToRefs(configStore);

const sessionStore = useSessionStore();
const { account, localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const destinationStore = useDestinationStore();
const { destinationList } = storeToRefs(destinationStore);
destinationStore.destinationSearch();
watch(destinationList, (newDestinations) => {
  if (newDestinations && newDestinations.length > 0) {
    navigateTo("/admin/library/setup");
  }
});

const destinationObject = ref({} as DestinationType);
const createDestinationServerErrors = ref({} as MobilettoOrmValidationErrors);

const onFormUpdated = (update: { field: string; value: any }) => {
  destinationObject.value[update.field] = update.value;
};

const onFormSubmitted = (src: DestinationType) =>
  destinationStore.destinationCreate(src, createDestinationServerErrors);
</script>
