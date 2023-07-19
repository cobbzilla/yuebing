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
          <v-form id="form" @submit.prevent="handleLogin">
            <div class="form-group">
              <v-text-field
                v-bind="usernameOrEmail"
                :label="messages.label_usernameOrEmail"
                type="text"
                name="email"
                class="form-control"
                :error="hasError(['usernameOrEmail', 'email', 'username'])"
                :error-messages="fieldErrors(['usernameOrEmail', 'email', 'username'])"
              />
            </div>
            <div class="form-group">
              <v-text-field
                v-bind="password"
                :label="messages.label_password"
                type="password"
                name="password"
                class="form-control"
                :error="hasError('password')"
                :error-messages="fieldErrors('password')"
                @keyup.enter="handleLogin"
              />
            </div>
            <div class="form-group">
              <v-btn class="btn btn-primary" :disabled="loginDisabled()" @click.stop="handleLogin">
                {{ messages.button_login }}
              </v-btn>
              <v-btn v-if="registrationEnabled" class="btn btn-primary" :to="signUpUrl" nuxt plain right>
                {{ messages.button_register }}
              </v-btn>
            </div>
          </v-form>
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
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import * as yup from "yup";
import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";
import { fieldErrorMessage } from "yuebing-messages";
import { UsernameAndPasswordSchema } from "yuebing-model";

const { errors, defineInputBinds, meta, handleSubmit } = useForm({
  validationSchema: toTypedSchema(UsernameAndPasswordSchema),
});

const usernameOrEmail = defineInputBinds("usernameOrEmail", {
  validateOnInput: true,
});
const password = defineInputBinds("password", {
  validateOnInput: true,
});

const config = storeToRefs(useConfigStore());
const publicConfig = ref(config.publicConfig);
const configLoaded = ref(false);
const registrationEnabled = ref(false);

watch(publicConfig, async (newConfig, oldConfig) => {
  if (!configLoaded.value) {
    configLoaded.value = true;
    registrationEnabled.value = newConfig?.registrationEnabled ? newConfig.registrationEnabled : false;
  }
});

const signUpUrl = "/signUp";

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const fieldErrors = (field: string | string[]) => {
  if (!meta.value.pending || !errors || !errors.value) return [];
  if (!Array.isArray(field)) {
    field = [field];
  }
  const fieldName = field[0];
  for (const f of field as string[]) {
    if ((errors.value as Record<string, string>)[f]) return [fieldErrorMessage(fieldName, errors.value[f], messages)];
  }
  return [];
};
const hasError = (field: string | string[]) => {
  return fieldErrors(field).length > 0;
};

const loginDisabled: () => boolean = () => {
  return session.userStatus.loggingIn || !usernameOrEmail || !password || false;
};

const handleLogin = handleSubmit((values) => {
  session.login(values.usernameOrEmail, values.password);
});
</script>
