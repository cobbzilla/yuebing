<template>
  <v-container class="ma-0 pa-0">
    <v-row v-if="fieldHeader !== ''" class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <h4>{{ messages[fieldHeader] }}</h4>
      </v-col>
    </v-row>
    <v-row v-for="(field, fieldIndex) in props.fields" :key="fieldIndex" class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-container v-if="fieldVisible(field) && isObject(field)" class="ma-0 pa-0">
          <OrmFormFields
            :fields="tabIndexed(field)"
            :root-thing="rootThing"
            :thing="props.thing[field.name!]"
            :read-only-object="readOnlyObject"
            :obj-path="nextPath(field.name!)"
            :field-header="''"
            :success-event="successEvent"
            :server-errors="serverErrors"
            :label-prefixes="labelPrefixes"
            :submitted="submitted"
            :saving="saving"
            :create="create"
            :form="form"
            :form-fields="formFields"
            :form-level="formLevel + 1"
            @update="onFieldUpdate"
          />
        </v-container>
        <v-container v-else-if="fieldVisible(field)" class="ma-0 pa-0">
          <OrmField
            :field="field"
            :root-thing="rootThing"
            :thing="thing"
            :read-only-object="readOnlyObject"
            :obj-path="nextPath(field.name!)"
            :value="valueOrDefault(thing, field)"
            :label-prefixes="labelPrefixes"
            :submitted="submitted"
            :saving="saving"
            :create="create"
            :success-event="successEvent"
            :form="form"
            :form-field="formFields[objPath]"
            @update="onFieldUpdate"
          />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { FormContext } from "vee-validate";
import { MobilettoOrmObject, ValidationErrors } from "mobiletto-orm";
import { MobilettoOrmFieldDefConfig } from "mobiletto-orm-typedef";
import { useSessionStore } from "~/stores/session";

const props = withDefaults(
  defineProps<{
    fieldHeader: string;
    rootThing: MobilettoOrmObject;
    thing: MobilettoOrmObject;
    readOnlyObject: () => boolean;
    objPath: string;
    fields: MobilettoOrmFieldDefConfig[];
    create: boolean;
    submitted: boolean;
    saving: boolean;
    successEvent: object;
    serverErrors: ValidationErrors;
    form: FormContext;
    formFields: Record<string, unknown>;
    labelPrefixes: string[];
    formLevel: number;
  }>(),
  {
    fieldHeader: () => "",
    rootThing: () => ({}),
    thing: () => ({}),
    readOnlyObject: () => () => false,
    objPath: () => "",
    fields: () => [],
    create: () => false,
    submitted: () => false,
    saving: () => false,
    serverErrors: () => ({}),
    labelPrefixes: () => ["label_"],
    formLevel: () => 0,
  },
);

const emit = defineEmits<{
  update: [update: { field: string; value: any }];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const valueOrDefault = (thing: any, field: MobilettoOrmFieldDefConfig) => {
  const fieldName: string = field.name as string;
  if (typeof thing[fieldName] !== "undefined") {
    return thing[fieldName];
  }
  if (typeof props.thing[fieldName] !== "undefined") {
    return props.thing[fieldName];
  }
  if (field.default) {
    return field.default;
  }
  return null;
};
const nextPath = (field: string) => {
  if (props.objPath === "") {
    return field;
  }
  return props.objPath + "." + field;
};
const tabIndexed = (field: MobilettoOrmFieldDefConfig): MobilettoOrmFieldDefConfig[] => {
  const fields = field.fields ? field.fields : {};
  return Array.isArray(field.tabIndexes)
    ? field.tabIndexes.map((t) => {
        return { name: t, ...fields[t] };
      })
    : Object.keys(fields).map((f) => {
        return { name: f, ...fields[f] };
      });
};
// const fieldError = (error: string) => {
//   return error ? fieldErrorMessage(props.field.name, error, messages.value, "") : "(no message)";
// };
const fieldVisible = (field: MobilettoOrmFieldDefConfig) => {
  if (field.control && ["hidden", "system"].includes(field.control)) {
    return false;
  }
  if (typeof field.when === "function") {
    try {
      if (!field.when(props.rootThing)) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return props.create || field.updatable === true;
};
const isObject = (field: MobilettoOrmFieldDefConfig) => {
  const fieldName: string = field.name as string;
  const isObj = field.type === "object" && field.fields && Object.keys(field.fields).length > 0;
  if (isObj) {
    if (!props.thing[fieldName] || typeof props.thing[fieldName] !== "object") {
      emit("update", { field: nextPath(fieldName), value: {} });
    }
  }
  return isObj;
};
const onFieldUpdate = (update: { field: string; value: any }) => {
  emit("update", update);
};
</script>
