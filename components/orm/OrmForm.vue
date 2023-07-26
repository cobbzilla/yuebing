<template>
  <v-form :id="formName" @submit.prevent="handleSave">
    <v-container class="ma-0 pa-0">
      <v-row>
        <v-col>
          <v-container class="ma-0 pa-0">
            <OrmFormFields
              :fields="fields"
              :validation-error="validationError"
              :thing="newThing"
              :read-only-object="readOnlyObject"
              :root-thing="newThing"
              :obj-path="''"
              :field-header="''"
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
        <v-col>
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
import * as yup from "yup";
import { MobilettoOrmObject, MobilettoOrmTypeDef, MobilettoOrmValidationErrors } from "mobiletto-orm";
import { MobilettoOrmFieldDefConfig } from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";

const props = withDefaults(
  defineProps<{
    typeDef: MobilettoOrmTypeDef;
    validationSchema: yup.Schema;
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
const validationError = ref({} as yup.ValidationError);

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
    const validated = await props.validationSchema.validate(newThing.value, { abortEarly: false });
    validationError.value = {};
    return validated;
  } catch (e) {
    if (e.errors) {
      validationError.value = e as yup.ValidationError;
      return null;
    } else {
      // console.log(`OrmForm.validate: error: ${e}`);
      return null;
    }
  }
};

const handleSave = async () => {
  submitted.value = true;
  const validated = await validate();
  if (validated) {
    emit("submitted", validated);
  }
};

const handleCancel = () => {
  emit("cancel");
};
</script>
