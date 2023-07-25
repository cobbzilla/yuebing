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
                :error="submitted && hasError(['usernameOrEmail', 'email', 'username'])"
                :error-messages="fieldError(['usernameOrEmail', 'email', 'username'])"
              />
            </div>
            <div class="form-group">
              <v-text-field
                v-bind="password"
                :label="messages.label_password"
                type="password"
                name="password"
                class="form-control"
                :error="submitted && hasError('password')"
                :error-messages="fieldError('password')"
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
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { fieldErrorMessage } from "yuebing-messages";
import { UsernameAndPasswordSchema } from "yuebing-model";
import { useSessionStore } from "~/stores/session";
import { useConfigStore } from "~/stores/config";

const { errors, defineInputBinds /*, meta */, handleSubmit } = useForm({
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
const submitted = ref(false);

watch(publicConfig, (newConfig) => {
  if (!configLoaded.value) {
    configLoaded.value = true;
    registrationEnabled.value = newConfig?.registrationEnabled ? newConfig.registrationEnabled : false;
  }
});

const signUpUrl = "/signUp";

const sessionStore = useSessionStore();
const session = storeToRefs(sessionStore);
const messages = ref(session.localeMessages);

const fieldError = (field: string | string[]) => {
  const errs = errors.value as Record<string, string>;
  const fields = Array.isArray(field) ? field : [field];
  const fieldName = fields[0];
  if (!submitted.value || !errs[fieldName]) {
    console.log(
      `fieldError: bailing early because !submitted.value (${!submitted.value})) || !errs[fieldName] (${!errs[
        fieldName
      ]})`,
    );
    return "";
  }
  for (const f of fields) {
    if (errs[f]) {
      return fieldErrorMessage(fieldName, errs[f], messages.value);
    }
  }
  return "";
};
const hasError = (field: string | string[]) => {
  return fieldError(field) !== "";
};
const loginDisabled: () => boolean = () => {
  return !usernameOrEmail || !password || false;
};

const handleLogin = async () => {
  submitted.value = true;
  await handleSubmit((values) => {
    console.log(`handleLogin: somehow these values passed validation: ${JSON.stringify(values)}`);
    sessionStore.login(values.usernameOrEmail, values.password);
  });
};
</script>
