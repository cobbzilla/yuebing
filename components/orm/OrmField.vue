<template>
  <v-container class="ma-0 pa-0">
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <div v-if="field.control === 'hidden'" v-show="false" class="ma-0 pa-0">
          <v-text-field
            v-show="false"
            v-if="!create"
            v-model="localValue"
            :v-bind="localValue"
            :type="'text'"
            :full-width="false"
            :name="field.name"
            class="form-control"
            :readonly="true"
          />
        </div>
        <div v-else-if="(field.updatable === false && !create) || isReadOnly() || field.control === 'label'" class="ma-0 pa-0">
          <OrmFieldDisplay :field="field" :value="value ? value : field.default ? field.default : null" :label="true" />
        </div>
        <div v-else-if="field.control === 'password'" class="ma-0 pa-0">
          <v-text-field
            v-model="localValue"
            :v-bind="localValue"
            :type="field.control"
            :full-width="false"
            :name="field.name"
            :value="value ? value : field.default ? field.default : null"
            :hint="hintForField()"
            persistent-hint
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-text-field>
        </div>
        <div v-else-if="field.control === 'textarea'" class="ma-0 pa-0">
          <v-textarea
            v-model="localValue"
            :v-bind="localValue"
            :full-width="true"
            :name="field.name"
            :value="value ? value : field.default ? field.default : null"
            :hint="hintForField()"
            persistent-hint
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-textarea>
        </div>
        <div v-else-if="field.control === 'duration'" class="ma-0 pa-0">
          <KitFieldDuration
              class="form-control"
              :full-width="true"
              :field-label="labelForField()"
              :field-value="value ? value : field.default ? field.default : null"
              :field-error-message="fieldError(objPath)"
              :label-prefixes="labelPrefixes"
              :hint="hintForField()"
              @update="sendUpdate"
          />
        </div>
        <div v-else-if="field.control === 'flag'" class="ma-0 pa-0">
          <v-checkbox
            v-model="localValue"
            :v-bind="localValue"
            :full-width="true"
            :name="field.name"
            :hint="hintForField()"
            persistent-hint
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-checkbox>
        </div>
        <div v-else-if="field.control === 'select'" class="ma-0 pa-0">
          <v-select
            v-model="localValue"
            :v-bind="localValue"
            :items="fieldItems()"
            item-value="value"
            item-title="label"
            :hint="hintForListItem()"
            persistent-hint
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault()"
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-select>
        </div>
        <div v-else-if="field.control === 'multi'" class="ma-0 pa-0">
          <v-select
            v-model="localValue"
            :v-bind="localValue"
            :items="fieldItems()"
            item-value="value"
            item-title="label"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault()"
            :hint="hintForField()"
            persistent-hint
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            :multiple="true"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-select>
        </div>
        <div v-else-if="isRange()">
          <v-slider
            v-model="localValue"
            :v-bind="localValue"
            :full-width="false"
            :name="field.name"
            :min="field.minValue"
            :max="field.maxValue"
            :value="valueOrDefault()"
            :hint="hintForField()"
            persistent-hint
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            thumb-label
            step="100"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-slider>
        </div>
        <div v-else-if="Array.isArray(localValue)">
          <v-list v-if="localValue && localValue.length > 0">
            <v-list-subheader>{{ labelForField() }}</v-list-subheader>
            <v-list-item
                v-for="(item, i) in localValue"
                :key="i"
                :value="item"
                color="primary"
                rounded="shaped"
            >
              <template v-slot:append>
                <v-btn icon @click.stop="removeItemFromArray(item)">
                  <Icon name="material-symbols:delete" />
                </v-btn>
              </template>
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-text-field
              v-model="itemToAddToArray"
              :v-bind="itemToAddToArray"
              type="text"
              :full-width="false"
              :name="field.name"
              :value="itemToAddToArray"
              :hint="hintForField()"
              persistent-hint
              class="form-control"
              :error="submitted && hasError(objPath)"
              :error-messages="fieldError(objPath)"
              @keyup.enter="addItemToArray"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
            <template #append-inner>
              <v-btn class="btn btn-primary" :disabled="!itemToAddToArray || itemToAddToArray.length === 0" @click.stop="addItemToArray">
                <Icon name="material-symbols:add" />
              </v-btn>
            </template>
          </v-text-field>
        </div>
        <div v-else class="ma-0 pa-0">
          <v-text-field
            v-model="localValue"
            :v-bind="localValue"
            :type="field.control"
            :full-width="false"
            :name="field.name"
            :value="valueOrDefault()"
            :hint="hintForField()"
            persistent-hint
            class="form-control"
            :error="submitted && hasError(objPath)"
            :error-messages="fieldError(objPath)"
            @update:model-value="sendUpdate"
          >
            <template #label>
              <span v-if="field.required" style="color: #ff0000"><strong>*&nbsp;</strong></span
              >{{ labelForField() }}
            </template>
          </v-text-field>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import {
  MobilettoOrmFieldDefConfig,
  MobilettoOrmFieldIndexableValue,
  MobilettoOrmObject,
  MobilettoOrmValidationErrors
} from "mobiletto-orm-typedef";
import { HINT_MESSAGE_SUFFIX } from "yuebing-messages";
import { findMessage, findMessageKey, messageExists } from "hokey-runtime";
import { useSessionStore } from "~/stores/sessionStore";
import { typeDefFieldErrorMessage } from "~/utils/model/adminHelper";

const props = withDefaults(
  defineProps<{
    field: MobilettoOrmFieldDefConfig;
    rootThing: MobilettoOrmObject;
    thing: MobilettoOrmObject;
    readOnlyObject: (obj: MobilettoOrmObject) => boolean;
    clientErrors: MobilettoOrmValidationErrors;
    serverErrors: MobilettoOrmValidationErrors;
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
    labelPrefixes: () => ["label_"]
  },
);

const emit = defineEmits<{
  update: [{ field: string; value: any }];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const localValue = ref(props.thing[props.field.name as string] || "");

const isReadOnly = () => {
  return typeof props.readOnlyObject === "function" && props.readOnlyObject(props.rootThing) === true;
};

const isRange = () => {
  return (
    props.field.control === "range" &&
    typeof props.field.minValue === "number" &&
    typeof props.field.maxValue === "number"
  );
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

const fieldItems = () => {
  const field = props.field;
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

const itemToAddToArray = ref("");

const removeItemFromArray = (item: string | number | boolean) => {
  if (localValue.value && localValue.value.length > 0) {
    const idx = localValue.value.indexOf(item);
    if (idx !== -1) {
      localValue.value.splice(idx, 1);
      sendUpdate(localValue.value);
    }
  }
}

const addItemToArray = () => {
  const idx = localValue.value.indexOf(itemToAddToArray.value);
  if (idx === -1) {
    localValue.value.push(itemToAddToArray.value);
    itemToAddToArray.value = "";
    sendUpdate(localValue.value);
  }
}

const labelForField = () => {
  const field = props.field;
  if (field.label && typeof field.label === "string" && field.label.length > 0) {
    return findMessage(field.label, messages.value, ["", ...props.labelPrefixes]);
  }
  const fieldName = field.name as string;
  return findMessage(fieldName, messages.value, props.labelPrefixes);
};

const hintForField = () => {
  const field = props.field
  const msgKey = field.label
    ? findMessageKey(field.label, messages.value, ["", ...props.labelPrefixes])
    : findMessageKey(field.name || "empty", messages.value, props.labelPrefixes);
  if (msgKey) {
    const hintKey = msgKey + HINT_MESSAGE_SUFFIX;
    if (messageExists(hintKey, messages.value)) {
      return messages.value[hintKey];
    }
  }
};

const hintForListItem = () => {
  const field = props.field
  if (field.control && field.control === "select" && field.items && localValue.value) {
    const item = field.items.find(i => i.value === localValue.value);
    if (item) {
      return item.hint ? messages.value[item.hint] : undefined;
    }
  }
  return hintForField();
};

const fieldError = (field: string | string[]) =>
  typeDefFieldErrorMessage(
    field,
    messages.value,
    props.labelPrefixes,
    props.clientErrors,
    props.serverErrors,
    props.submitted,
    props.objPath,
  );

const hasError = (field: string | string[]) => {
  return fieldError(field) !== "";
};

const sendUpdate = (val: MobilettoOrmFieldIndexableValue) => {
  localValue.value = val;
  emit("update", { field: props.objPath, value: val });
}
</script>
