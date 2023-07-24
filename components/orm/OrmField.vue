<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="(field.updatable === false && !create) || isReadOnly()">
          <OrmFieldDisplay :field="field" :value="value ? value : field.default ? field.default : null" :label="true" />
        </div>
        <div v-else-if="field.control === 'text' || field.control === 'password'">
          <v-text-field
            v-model="localValue"
            :v-bind="field.name"
            :type="field.control"
            :label="labelFor(field)"
            :full-width="false"
            :name="field.name"
            :value="value ? value : field.default ? field.default : null"
            class="form-control"
            :error="submitted && errors.length > 0"
            :error-messages="submitted ? fieldError(errors) : undefined"
            @change="$emit('update', { field: objPath, value: localValue })"
          />
        </div>
        <div v-else-if="field.control === 'label'">
          <v-text-field
            v-if="!create"
            v-model="localValue"
            :v-bind="field.name"
            :type="'text'"
            :label="labelFor(field)"
            :full-width="false"
            :name="field.name"
            class="form-control"
            :readonly="true"
          />
        </div>
        <div v-else-if="field.control === 'textarea'">
          <v-textarea
            v-model="localValue"
            :v-bind="field.name"
            :label="labelFor(field)"
            :full-width="true"
            :name="field.name"
            :value="value ? value : field.default ? field.default : null"
            class="form-control"
            :error="submitted && errors.length > 0"
            :error-messages="submitted ? fieldError(errors) : undefined"
            @change="$emit('update', { field: objPath, value: localValue })"
          />
        </div>
        <div v-else-if="field.control === 'flag'">
          <v-checkbox
            v-model="localValue"
            :v-bind="field.name"
            :label="labelFor(field)"
            :full-width="true"
            :name="field.name"
            class="form-control"
            :error="submitted && errors.length > 0"
            :error-messages="submitted ? fieldError(errors) : undefined"
            @change="$emit('update', { field: objPath, value: localValue })"
          />
        </div>
        <div v-else-if="field.control === 'select'">
          <v-select
            v-model="localValue"
            :v-bind="field.name"
            :label="labelFor(field)"
            :items="fieldItems(field)"
            item-value="value"
            item-text="label"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault"
            class="form-control"
            :error="submitted && errors.length > 0"
            :error-messages="submitted ? fieldError(errors) : undefined"
            @change="$emit('update', { field: objPath, value: localValue })"
          />
        </div>
        <div v-else-if="field.control === 'multi'">
          <v-select
            v-model="localValue"
            :v-bind="field.name"
            :label="labelFor(field)"
            :items="fieldItems(field)"
            item-value="value"
            item-text="label"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault"
            class="form-control"
            :error="submitted && errors.length > 0"
            :error-messages="submitted ? fieldError(errors) : undefined"
            :multiple="true"
            @change="$emit('update', { field: objPath, value: localValue })"
          />
        </div>
        <div v-else>
          <v-text-field
            v-model="localValue"
            :v-bind="field.name"
            :type="field.control"
            :label="labelFor(field)"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault"
            class="form-control"
            :error="submitted && errors.length > 0"
            :error-messages="submitted ? fieldError(errors) : undefined"
            @change="$emit('update', { field: objPath, value: localValue })"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { MobilettoOrmObject } from "mobiletto-orm";
import { MobilettoOrmFieldDefConfig } from "mobiletto-orm-typedef";
import { fieldErrorMessage, findMessage } from "yuebing-messages";
import { useSessionStore } from "~/stores/session";

const props = withDefaults(
  defineProps<{
    field: MobilettoOrmFieldDefConfig;
    rootThing: MobilettoOrmObject;
    thing: MobilettoOrmObject;
    readOnlyObject: (obj: MobilettoOrmObject) => boolean;
    objPath: string;
    value: any;
    create: boolean;
    submitted: boolean;
    saving: boolean;
    successEvent: object;
    defineInputBinds: any;
    meta: any;
    errors: any;
    labelPrefixes: string[];
  }>(),
  {
    readOnlyObject: () => () => false,
    create: () => false,
    submitted: () => false,
    saving: () => false,
    labelPrefixes: () => ["label_"],
  },
);

/* const emit = */ defineEmits<{
  submitted: [];
  update: [field: string, value: any];
  cancel: [];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

/* const localField = */ props.defineInputBinds(props.field.name, {
  validateOnInput: true,
});

const localValue = ref(props.value ? props.value : props.field.default ? props.field.default : null);

const isReadOnly = () => {
  // console.log(
  //   `isReadOnly(${props.field.name}) evaluating with props.rootThing=${JSON.stringify(
  //     props.rootThing,
  //   )} and props.readOnlyObject(props.rootThing) == ${props.readOnlyObject(props.rootThing)}`,
  // );
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

const successEvent = ref(props.successEvent);

watch(successEvent, (newEvent) => {
  if (newEvent && typeof newEvent === "object" && Object.keys(newEvent).length > 0) {
    localValue.value = valueOrDefault();
  }
});

const fieldError = (error: any) => {
  return error ? fieldErrorMessage(props.field, error, messages.value, props.labelPrefixes) : "(no message)";
};

const fieldItems = (field: MobilettoOrmFieldDefConfig) => {
  return !field.items
    ? []
    : field.items.map((item) => {
        return {
          value: item.value,
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
</script>
