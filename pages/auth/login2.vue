<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages.title_login }}</h2>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col>
          <OrmForm
            form-name="login_form"
            :type-def="UsernameAndPasswordTypeDef"
            :validation-schema="UsernameAndPasswordSchema"
            :field-schema="UsernameAndPasswordSchemaFields"
            type-name-message="login_form"
            :thing="{}"
            save-button-message="button_login"
            cancel-button-message="button_register"
            :fields="UsernameAndPasswordTypeDef.tabIndexedFields()"
            :create="true"
            :submitted="objectSubmitted"
            :saving="false"
            :read-only-object="() => false"
            :success-event="addObjectSuccess"
            :server-errors="addObjectError"
            :label-prefixes="['', 'label_']"
            @submitted="onLoginSubmitted"
            @cancel="onSignUp"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <NuxtLink to="/reset" class="btn btn-link">
            {{ messages.button_forgot_password }}
          </NuxtLink>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import {
  UsernameAndPasswordSchema,
  UsernameAndPasswordSchemaFields,
  UsernameAndPasswordType,
  UsernameAndPasswordTypeDef,
} from "yuebing-model";
import { useSessionStore } from "~/stores/session";
// import { useConfigStore } from "~/stores/config";
// import { fieldErrorMessage } from "yuebing-messages";

const onLoginSubmitted = (login: UsernameAndPasswordType) => {
  sessionStore.login(login.usernameOrEmail, login.password);
};
const onSignUp = () => {
  navigateTo("/auth/register2");
};

const sessionStore = useSessionStore();
const session = storeToRefs(sessionStore);
const messages = ref(session.localeMessages);

const objectSubmitted = ref(false);
const addObjectSuccess = ref({});
const addObjectError = ref({});
</script>
