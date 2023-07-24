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
            :submitted="objectSubmitted"
            :saving="false"
            :read-only-object="() => false"
            :success-event="addObjectSuccess"
            :server-errors="addObjectError"
            :label-prefixes="['', 'label_']"
            @submitted="onSignUp"
            @cancel="onSignIn"
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
import { RegistrationSchema, RegistrationTypeDef } from "yuebing-model";
import { useSessionStore } from "~/stores/session";
// import { useConfigStore } from "~/stores/config";
// import { fieldErrorMessage } from "yuebing-messages";

const sessionStore = useSessionStore();
const session = storeToRefs(sessionStore);
const messages = ref(session.localeMessages);

const objectSubmitted = ref(false);
const addObjectSuccess = ref({});
const addObjectError = ref({});

const regTypeDef = hideOrmFields(RegistrationTypeDef, ["flags"]);

const onSignIn = () => {
  navigateTo("/auth/login2");
};
const onSignUp = (obj) => {
  sessionStore.register(obj);
};
</script>
