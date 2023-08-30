<template>
  <v-container>
    <v-row>
      <v-col v-if="field.control !== 'hidden'">
        <div v-if="field.control === 'password'">
          <div v-if="label">
            <v-text-field value="******" disabled readonly />
          </div>
          <div v-else>******</div>
        </div>
        <div v-else-if="field.render === 'datetime'">
          <div v-if="label">
            <v-text-field :value="dateMessage('label_date_and_time', value)" disabled readonly />
          </div>
          <div v-else>
            {{ dateMessage("label_date_and_time", value) }}
          </div>
        </div>
        <div v-else-if="field.control === 'flag'">
          <div v-if="typeof field.render === 'function'">
            <Icon v-if="!!renderField()" name="material-symbols:check-circle-outline-rounded" />
            <Icon v-else name="material-symbols:close" />
            {{ label ? labelForField() : "" }}
          </div>
          <div v-else>
            <Icon v-if="value" name="material-symbols:check-circle-outline-rounded" />
            <Icon v-else name="material-symbols:close" />
            {{ label ? labelForField() : "" }}
          </div>
        </div>
        <div v-else-if="Array.isArray(value)">
          <div v-if="typeof field.render === 'function'">
            <div v-if="label">
              <v-text-field :value="renderField()" disabled readonly />
            </div>
            <div v-else>
              {{ renderField() }}
            </div>
          </div>
          <div v-else>
            <div v-if="label">
              <v-text-field :value="value.join(messages['locale_text_list_separator'])" disabled readonly />
            </div>
            <div v-else>
              {{ value.join(messages["locale_text_list_separator"]) }}
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="typeof field.render === 'function'">
            <div v-if="label">
              <v-text-field :value="renderField" disabled readonly />
            </div>
            <div v-else>
              {{ renderField }}
            </div>
          </div>
          <div v-else>
            <div v-if="label">
              <v-text-field :value="value" disabled readonly />
            </div>
            <div v-else>
              {{ value }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { MobilettoOrmFieldDefConfig } from "mobiletto-orm-typedef";
import { parseDateMessage, findMessage } from "hokey-runtime";
import { useConfigStore } from "~/stores/configStore";
import { useSessionStore } from "~/stores/sessionStore";

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);

const config = storeToRefs(useConfigStore());
const publicConfig = ref(config.publicConfig);

const props = withDefaults(
  defineProps<{
    field: MobilettoOrmFieldDefConfig;
    value: any;
    label: boolean;
    labelPrefixes: string[];
  }>(),
  {
    value: () => null,
    label: () => false,
    labelPrefixes: () => ["label_"],
  },
);

const dateMessage = (msg: string, val: number | string | Date): string => {
  return parseDateMessage(messages.value[msg], val, messages.value);
};

const labelForField = () => {
  const field = props.field;
  if (field.label && typeof field.label === "string" && field.label.length > 0) {
    return findMessage(field.label, messages.value, ["", ...props.labelPrefixes]);
  }
  const fieldName = field.name as string;
  return findMessage(fieldName, messages.value, props.labelPrefixes);
};

const renderField = () => {
  return publicConfig?.value?.title && typeof props.field.render === "function"
      ? props.field.render(props.value, messages.value, publicConfig?.value?.title)
      : props.value;
}
</script>
