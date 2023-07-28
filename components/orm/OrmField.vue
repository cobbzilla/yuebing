<template>
  <v-container class="ma-0 pa-0">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <div v-if="(field.updatable === false && !create) || isReadOnly()" class="ma-0 pa-0">
          <OrmFieldDisplay :field="field" :value="value ? value : field.default ? field.default : null" :label="true" />
        </div>
        <div v-else-if="field.control === 'text' || field.control === 'password'" class="ma-0 pa-0">
          <v-text-field
            v-model="localValue"
            :v-bind="localValue"
            :type="field.control"
            :label="labelFor(field)"
            :full-width="false"
            :name="field.name"
            :value="value ? value : field.default ? field.default : null"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate()"
          />
        </div>
        <div v-else-if="field.control === 'label'" class="ma-0 pa-0">
          <v-text-field
            v-if="!create"
            v-model="localValue"
            :v-bind="localValue"
            :type="'text'"
            :label="labelFor(field)"
            :full-width="false"
            :name="field.name"
            class="form-control"
            :readonly="true"
          />
        </div>
        <div v-else-if="field.control === 'textarea'" class="ma-0 pa-0">
          <v-textarea
            v-model="localValue"
            :v-bind="localValue"
            :label="labelFor(field)"
            :full-width="true"
            :name="field.name"
            :value="value ? value : field.default ? field.default : null"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate()"
          />
        </div>
        <div v-else-if="field.control === 'flag'" class="ma-0 pa-0">
          <v-checkbox
            v-model="localValue"
            :v-bind="localValue"
            :label="labelFor(field)"
            :full-width="true"
            :name="field.name"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate()"
          />
        </div>
        <div v-else-if="field.control === 'select'" class="ma-0 pa-0">
          <v-select
            v-model="localValue"
            :v-bind="localValue"
            :label="labelFor(field)"
            :items="fieldItems(field)"
            item-value="value"
            item-title="label"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault()"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate()"
          />
        </div>
        <div v-else-if="field.control === 'multi'" class="ma-0 pa-0">
          <v-select
            v-model="localValue"
            :v-bind="localValue"
            :label="labelFor(field)"
            :items="fieldItems(field)"
            item-value="value"
            item-title="label"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault()"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            :multiple="true"
            @update:model-value="sendUpdate()"
          />
        </div>
        <div v-else class="ma-0 pa-0">
          <v-text-field
            v-model="localValue"
            :v-bind="localValue"
            :type="field.control"
            :label="labelFor(field)"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault()"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate()"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ValidationError } from "yup";
import { MobilettoOrmFieldDefConfig, MobilettoOrmObject, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { findMessage } from "yuebing-messages";
import { useSessionStore } from "~/stores/session";

const props = withDefaults(
  defineProps<{
    field: MobilettoOrmFieldDefConfig;
    rootThing: MobilettoOrmObject;
    thing: MobilettoOrmObject;
    readOnlyObject: (obj: MobilettoOrmObject) => boolean;
    serverErrors: MobilettoOrmValidationErrors;
    validationError: ValidationError;
    objPath: string;
    value: any;
    create: boolean;
    submitted: boolean;
    saving: boolean;
    labelPrefixes: string[];
  }>(),
  {
    readOnlyObject: () => () => false,
    create: () => false,
    submitted: () => false,
    saving: () => false,
    value: () => "",
    labelPrefixes: () => ["label_"],
  },
);

const emit = defineEmits<{
  update: [{ field: string; value: any }];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const localValue = ref(props.thing[props.field.name as string] || "");

const sendUpdate = () => {
  // console.log(`sendUpdate: value of ${props.objPath} is ${localValue.value}`);
  emit("update", { field: props.objPath, value: localValue.value });
};

const isReadOnly = () => {
  return typeof props.readOnlyObject === "function" && props.readOnlyObject(props.rootThing) === true;
};

const valueOrDefault = () => {
  if (typeof props.value !== "undefined" && props.value != null) {
    return props.value;
  }
  const fieldName = props.field.name as string;
  if (typeof props.thing[fieldName] !== "undefined") {
    return props.thing[fieldName];
  }
  if (props.field.default) {
    return props.field.default;
  }
  return null;
};

const fieldItems = (field: MobilettoOrmFieldDefConfig) => {
  return !field.items
    ? []
    : field.items.map((item) => {
        return {
          value: `${item.value}`,
          label:
            typeof item.rawLabel === "boolean" && item.rawLabel === true
              ? item.label
              : messages.value[item.label as string],
        };
      });
};

const labelFor = (field: MobilettoOrmFieldDefConfig) => {
  if (field.label && typeof field.label === "string" && field.label.length > 0) {
    return findMessage(field.label, messages.value, ["", ...props.labelPrefixes]);
  }
  const fieldName = field.name as string;
  return findMessage(fieldName, messages.value, props.labelPrefixes);
};

const fieldError = (field: string | string[]) =>
  ormFieldErrorMessage(
    field,
    messages.value,
    props.validationError,
    props.serverErrors,
    props.submitted,
    props.objPath,
  );

const hasError = (field: string | string[]) => {
  return fieldError(field) !== "";
};
</script>
