<template>
  <v-container>
    <v-row>
      <v-col v-if="isSetup()">
        <h2>{{ messages.title_register_setup }}</h2>
        <b>
          {{ msg("title_register_setup_details") }}
        </b>
      </v-col>
      <v-col v-else>
        <h2>{{ messages.title_register }}</h2>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <OrmForm
            form-name="register_form"
            :type-def="regTypeDef"
            :validation-schema="RegistrationSchema"
            type-name-message="register_form"
            :thing="{}"
            :save-button-message="registerButtonMessage()"
            :cancel-button-message="cancelButtonMessage()"
            :fields="regTypeDef.tabIndexedFields()"
            :create="true"
            :read-only-object="() => false"
            :server-errors="registerServerErrors"
            :label-prefixes="['', 'label_']"
            @submitted="onRegistrationSubmitted"
            @update="onRegistrationUpdated"
            @cancel="onSignIn"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { AuthAccountType, RegistrationSchema, RegistrationType, RegistrationTypeDef } from "yuebing-model";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";
import { parseMessage } from "yuebing-messages";

const sessionStore = useSessionStore();
const session = storeToRefs(sessionStore);
const messages = ref(session.localeMessages);

const config = useConfigStore();
const title = () => (config?.publicConfig?.title ? config.publicConfig.title : "Yuebing 🥮");

const msg = (msgKey: string) => parseMessage(msgKey, messages.value, { title: title() });

const registrationObject = ref({} as RegistrationType);
const registerServerErrors = ref({} as MobilettoOrmValidationErrors);

const regTypeDef = hideOrmFields(RegistrationTypeDef, ["flags"]);

const onSignIn = () => {
  navigateTo("/auth/login");
};

const onRegistrationUpdated = (update: { field: string; value: any }) => {
  registrationObject.value[update.field] = update.value;
};

const route = useRoute();
const isSetup = () => route.path.startsWith("/setup");
const cancelButtonMessage = () => (isSetup() ? undefined : "button_login");
const registerButtonMessage = () => (isSetup() ? "title_register_setup" : "button_register");

const onRegistrationSubmitted = (reg: RegistrationType) => sessionStore.register(reg, registerServerErrors);
</script>
