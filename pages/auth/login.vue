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
            type-name-message="login_form"
            :thing="usernameAndPasswordObject"
            save-button-message="button_login"
            cancel-button-message="button_register"
            :fields="UsernameAndPasswordTypeDef.tabIndexedFields()"
            :create="true"
            :read-only-object="() => false"
            :server-errors="loginServerErrors"
            :label-prefixes="['', 'label_']"
            @submitted="onLoginSubmitted"
            @update="onLoginUpdated"
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
import { storeToRefs } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import {
  AuthAccountType,
  UsernameAndPasswordSchema,
  UsernameAndPasswordType,
  UsernameAndPasswordTypeDef,
} from "yuebing-model";
import { useSessionStore } from "~/stores/session";

const sessionStore = useSessionStore();
const session = storeToRefs(sessionStore);
const messages = ref(session.localeMessages);

const usernameAndPasswordObject = ref({} as UsernameAndPasswordType);
const loginServerErrors = ref({} as MobilettoOrmValidationErrors);

const onSignUp = () => {
  navigateTo("/auth/register");
};

const onLoginUpdated = (update: { field: string; value: any }) => {
  usernameAndPasswordObject.value[update.field] = update.value;
};

const onLoginSubmitted = (login: UsernameAndPasswordType) =>
  sessionStore.login(login.usernameOrEmail, login.password, loginServerErrors);
</script>
