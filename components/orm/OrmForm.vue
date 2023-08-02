<template>
  <v-form :id="formName" @submit.prevent="handleSave">
    <v-container class="ma-0 pa-0">
      <v-row>
        <v-col>
          <v-container class="ma-0 pa-0">
            <OrmFormFields
              :fields="fields"
              :thing="newThing"
              :read-only-object="readOnlyObject"
              :root-thing="newThing"
              :obj-path="''"
              :field-header="''"
              :client-errors="clientErrors"
              :server-errors="serverErrors"
              :label-prefixes="labelPrefixes"
              :submitted="submitted"
              :saving="saving"
              :create="create"
              :form-level="0"
              @update="onFieldUpdate"
            />
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleSave">
            {{ messages[props.saveButtonMessage] }}
          </v-btn>
        </v-col>
        <v-col v-if="showCancel()">
          <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleCancel">
            {{ messages[props.cancelButtonMessage] }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  MobilettoOrmFieldDefConfig,
  MobilettoOrmObject,
  MobilettoOrmTypeDef,
  MobilettoOrmValidationError,
  MobilettoOrmValidationErrors,
} from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";

const props = withDefaults(
  defineProps<{
    typeDef: MobilettoOrmTypeDef;
    typeNameMessage: string;
    formName: string;
    thing: MobilettoOrmObject;
    readOnlyObject: () => boolean;
    saveButtonMessage: string;
    cancelButtonMessage: string;
    fields: MobilettoOrmFieldDefConfig[];
    create: boolean;
    serverErrors: MobilettoOrmValidationErrors;
    labelPrefixes: string[];
  }>(),
  {
    thing: () => ({}),
    readOnlyObject: () => () => false,
    saveButtonMessage: "button_update",
    cancelButtonMessage: "button_cancel",
    fields: () => [],
    create: () => false,
    serverErrors: () => ({}),
    labelPrefixes: () => ["", "label_"],
  },
);
const emit = defineEmits<{
  submitted: [obj: MobilettoOrmObject];
  update: [update: { field: string; value: any }];
  cancel: [];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const newThing = ref(JSON.parse(JSON.stringify(props.thing)));
const submitted = ref(false);
const saving = ref(false);
const clientErrors = ref({} as MobilettoOrmValidationErrors);
const serverErrors = ref(props.serverErrors);

const onFieldUpdate = (update: { field: string; value: any }) => {
  if (update) {
    deepUpdate(newThing.value, update.field, update.value);
    emit("update", update);
    validate();
  }
};

const validate = async () => {
  try {
    const validated = await props.typeDef.validate(newThing.value, props.create ? undefined : props.thing);
    clientErrors.value = {} as MobilettoOrmValidationErrors;
    // console.log(`OrmForm.handleSave: validated: ${JSON.stringify(newThing.value)} ===> ${JSON.stringify(validated)}`);
    return validated;
  } catch (e) {
    if (e instanceof MobilettoOrmValidationError) {
      // console.log(`OrmForm.validate (submitted=${submitted.value}): validation error ${e}: ${JSON.stringify(e)}`);
      clientErrors.value = e.errors;
    } else {
      // console.log(`OrmForm.validate: unknown error ${e}: ${JSON.stringify(e)}`);
    }
    return null;
  }
};

const handleSave = async () => {
  submitted.value = true;
  const validated = await validate();
  if (validated) {
    emit("submitted", validated);
  }
};

const showCancel = () =>
  props.cancelButtonMessage && props.cancelButtonMessage.length && props.cancelButtonMessage.length > 0;

const handleCancel = () => {
  emit("cancel");
};
</script>
