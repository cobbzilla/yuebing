<template>
  <v-container>
    <v-row>
      <v-col>
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
            save-button-message="button_register"
            cancel-button-message="button_login"
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
import { RegistrationSchema, RegistrationType, RegistrationTypeDef } from "yuebing-model";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { useSessionStore } from "~/stores/session";

const sessionStore = useSessionStore();
const session = storeToRefs(sessionStore);
const messages = ref(session.localeMessages);

const registrationObject = ref({} as RegistrationType);
const registerServerErrors = ref({} as MobilettoOrmValidationErrors);

const regTypeDef = hideOrmFields(RegistrationTypeDef, ["flags"]);

const onSignIn = () => {
  navigateTo("/auth/login");
};

const onRegistrationUpdated = (update: { field: string; value: any }) => {
  registrationObject.value[update.field] = update.value;
};

const onRegistrationSubmitted = (reg: RegistrationType) => {
  sessionStore.register(reg, registerServerErrors);
};
</script>
