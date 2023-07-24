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
            @update="onFieldUpdate"
            @submitted="onLoginSubmitted"
            @cancel="onCancelLogin"
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
import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";
import { fieldErrorMessage } from "yuebing-messages";
import { UsernameAndPasswordSchema, UsernameAndPasswordType, UsernameAndPasswordTypeDef } from "yuebing-model";

const onFieldUpdate = (update: { field: string; value: any }) => {
  console.log(`login2.onFieldUpdate received: ${JSON.stringify(update)}`);
};
const onLoginSubmitted = (login: UsernameAndPasswordType) => {
  console.log(`login2.onLoginSubmitted received: ${JSON.stringify(login)}`);
  session.login(login.usernameOrEmail, login.password);
};
const onCancelLogin = () => {
  console.log("login2.onCancelLogin called");
};

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const objectSubmitted = ref(false);
const addObjectSuccess = ref({});
const addObjectError = ref({});
</script>
