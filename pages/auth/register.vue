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
            :type-def="regType"
            :validation-schema="RegistrationSchema"
            type-name-message="register_form"
            :thing="{}"
            :save-button-message="registerButtonMessage()"
            :cancel-button-message="cancelButtonMessage()"
            :fields="regType.tabIndexedFields()"
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
import { RegistrationSchema, RegistrationType } from "yuebing-model";
import { MobilettoOrmValidationError, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";
import { RegistrationFormTypeDef } from "~/utils/auth";
import { parseMessage } from "yuebing-messages";
import { isSetup, configTitle, configRegistrationEnabled } from "~/utils/config";
import { useConfigStore } from "~/stores/config";

const configStore = useConfigStore();
const { publicConfig } = storeToRefs(configStore);
await configStore.loadPublicConfig();
const needsAdmin = () => publicConfig.value?.needsAdmin || false;

const sessionStore = useSessionStore();
const { account, localeMessages } = storeToRefs(sessionStore);
const messages = localeMessages;

const msg = (msgKey: string) => parseMessage(msgKey, messages.value, { title: configTitle() });

const regType = RegistrationFormTypeDef;
const registrationObject = ref({} as RegistrationType);
const registerServerErrors = ref({} as MobilettoOrmValidationErrors);

const onSignIn = () => navigateTo("/auth/login");

const onRegistrationUpdated = (update: { field: string; value: any }) => {
  registrationObject.value[update.field] = update.value;
};

const cancelButtonMessage = () => (isSetup() ? "" : "button_login");
const registerButtonMessage = () => (isSetup() ? "title_register_setup" : "button_register");

const onRegistrationSubmitted = (reg: RegistrationType) =>
  sessionStore
    .register(reg, registerServerErrors)
    .then((acct) => {
      if (acct) {
        sessionStore.setLocale(account.locale, true);
      } else {
        console.warn(`onRegistrationSubmitted: no account!`);
      }
    })
    .catch((e) => {
      if (e instanceof MobilettoOrmValidationError) {
        registerServerErrors.value = e.errors;
      } else {
        throw e;
      }
    });

if (isSetup()) {
  if (!needsAdmin()) {
    const regEnabled = configRegistrationEnabled();
    console.log(`register ===> /signUp or /signIn (regEnabled=${regEnabled})`);
    navigateTo(regEnabled ? "/signUp" : "/signIn");
  }
} else {
  if (!configRegistrationEnabled()) {
    console.log(`register ===> /signIn (reg not enabled)`);
    navigateTo("/signIn");
  }
}

watch(account, (newAccount) => {
  if (Object.keys(newAccount).length > 0) {
    navigateTo(newAccount.admin ? "/admin" : "/home");
  }
});
</script>
