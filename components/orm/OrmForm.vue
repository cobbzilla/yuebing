<template>
  <v-form :id="formName" @submit.prevent="handleSave">
    <v-container class="ma-0 pa-0">
      <v-row>
        <v-col>
          <v-container class="ma-0 pa-0">
            <OrmFormFields
              :fields="fields"
              :validation-schema="validationSchema"
              :thing="newThing"
              :read-only-object="readOnlyObject"
              :root-thing="newThing"
              :obj-path="''"
              :field-header="''"
              :server-errors="serverErrors"
              :success-event="successEvent"
              :label-prefixes="labelPrefixes"
              :submitted="submitted"
              :saving="saving"
              :create="create"
              :form="form"
              :form-fields="formFields"
              :form-level="0"
              @update="onFieldUpdate"
            />
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleSave">
            {{
              msg(props.saveButtonMessage, {
                type: messages[props.typeNameMessage],
              })
            }}
          </v-btn>
        </v-col>
        <v-col>
          <v-btn class="btn btn-primary" :disabled="saving" @click.stop="handleCancel">
            {{
              msg(props.cancelButtonMessage, {
                type: messages[props.typeNameMessage],
              })
            }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";
import { findMessage, parseMessage } from "yuebing-messages";
import { MobilettoOrmFieldDefConfigs, MobilettoOrmObject, MobilettoOrmTypeDef, ValidationErrors } from "mobiletto-orm";
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
    submitted: boolean;
    saving: boolean;
    successEvent: object;
    serverErrors: ValidationErrors;
    labelPrefixes: string[];
  }>(),
  {
    thing: () => ({}),
    readOnlyObject: () => () => false,
    saveButtonMessage: "button_update",
    cancelButtonMessage: "button_cancel",
    fields: () => [],
    create: () => false,
    submitted: () => false,
    saving: () => false,
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
const msg = (key: string, ctx: Record<string, unknown>) =>
  parseMessage(findMessage(key, messages.value, props.labelPrefixes), messages.value, ctx);

const newThing = ref(JSON.parse(JSON.stringify(props.thing)));

// const { errors, defineInputBinds, defineComponentBinds, meta, handleSubmit } = useForm({
//   validationSchema: toTypedSchema(props.validationSchema),
// });
const form = reactive(
  useForm({
    validationSchema: toTypedSchema(props.validationSchema),
  }),
);
const formFields: Record<string, unknown> = reactive({});
const buildFields = (formFields: Record<string, unknown>, typeFields: MobilettoOrmFieldDefConfigs, objPath: string) => {
  Object.keys(typeFields).forEach((fieldName) => {
    const field = typeFields[fieldName];
    const fieldPath = objPath + field.name;
    if (field.fields) {
      buildFields(formFields, field.fields, fieldPath + ".");
    } else {
      formFields[fieldPath] = reactive(form.defineInputBinds(fieldPath));
    }
  });
};
buildFields(formFields, props.typeDef.fields, "");

const successEvent = ref(props.successEvent);
const serverErrors = ref(props.serverErrors);

watch(serverErrors, (newError) => {
  if (newError && newError.errors && Object.keys(newError.errors).length > 0) {
    // what to do here
    // console.log(`found serverErrors, need to set these somehow: ${JSON.stringify(newError)}`);
    // this.$refs[props.formName].setErrors(newError.errors);
  }
});

watch(successEvent, (newEvent) => {
  if (newEvent && typeof newEvent === "object" && Object.keys(newEvent).length > 0) {
    Object.assign(newThing, JSON.parse(JSON.stringify(props.thing)));
  }
});

const onFieldUpdate = (update: { field: string; value: any }) => {
  if (update) {
    console.log(`OrmForm.onFieldUpdate: deep updating ${update.field} with value ${update.value}`);
    deepUpdate(newThing.value, update.field, update.value);
    emit("update", update);
  }
};

const handleSave = form.handleSubmit((values: Record<string, any>) => {
  try {
    console.log(`OrmForm.handleSave: emitting submitted: ${JSON.stringify(values)}`);
    emit("submitted", values as MobilettoOrmObject);
  } catch (e) {
    // console.error(`OrmForm.handleSave failed: ${e}`);
  }
});

const handleCancel = () => {
  emit("cancel");
};
</script>
