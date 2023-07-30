<template>
  <v-container>
    <v-row v-if="showSuccessSnackbar && isSuccess(addObjectSuccess)">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            <!--            snackbar:-->
            <!--            {{-->
            <!--              msg(addObjectSuccessMessage, {-->
            <!--                id: (addObjectSuccess as MobilettoOrmObject)[typeDef.idField(addObjectSuccess) as string],-->
            <!--                type: messages[typeNameMessage],-->
            <!--              })-->
            <!--            }}-->
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && isError(addObjectError)">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{
              msg(addObjectErrorMessage, {
                type: messages[typeNameMessage],
                error: `${addObjectError ?? "undefined"}`,
              })
            }}
          </h4>
          <small>
            <vue-json-pretty
              :data="JSON.stringify(addObjectError)"
              :show-line="false"
              :show-double-quotes="false"
              :select-on-click-node="false"
              :highlight-selected-node="false"
              :collapsed-on-click-brackets="false"
            />
          </small>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h4>{{ msg(addObjectMessage, { type: messages[typeNameMessage] }) }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <OrmForm
          :form-name="addFormName"
          :type-def="typeDef"
          :type-name-message="typeNameMessage"
          :thing="addObjectObject"
          save-button-message="admin_button_add"
          :fields="objectFields"
          :create="true"
          :server-errors="addObjectError"
          :label-prefixes="labelPrefixes"
          @update="onAddOrmUpdate"
          @submitted="onAddOrmSubmit"
          @cancel="onCancelOrmForm"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

import { storeToRefs } from "pinia";
import { MobilettoOrmObject, MobilettoOrmTypeDef, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { findMessage, parseMessage } from "yuebing-messages";
import { SNACKBAR_ERROR_DEFAULT_TIMEOUT } from "~/utils/ui";
import { useSessionStore } from "~/stores/session";

const props = withDefaults(
  defineProps<{
    typeDef: MobilettoOrmTypeDef;
    typeNameMessage: string;
    labelPrefixes: string[];

    addObjectObject: MobilettoOrmObject;
    objectSubmitted: boolean;
    addObjectMessage: string;
    addObjectServerErrors: MobilettoOrmValidationErrors;
    addObjectSuccessMessage: string;
    addObjectErrorMessage: string;
  }>(),
  {
    labelPrefixes: () => ["label_"],
    objectSubmitted: () => false,
    addObjectMessage: () => "admin_button_add",
    addObjectSuccessMessage: () => "admin_info_added",
    addObjectErrorMessage: () => "admin_info_add_error",
  },
);

const emit = defineEmits<{
  newObjectUpdate: [update: { field: string; value: any }];
  newObjectSubmit: [thing: MobilettoOrmObject];
  newObjectCancel: [];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);
const msg = (key: string, ctx: Record<string, unknown>) =>
  parseMessage(findMessage(key, messages.value, props.labelPrefixes), messages.value, ctx);

const showSuccessSnackbar = ref(false);
const successSnackTimeout = ref(-1);
const showErrorSnackbar = ref(false);
const errorSnackTimeout = ref(-1);

const isNonEmptyObject = (obj: object) => obj && typeof obj === "object" && Object.keys(obj).length > 0;
const isSuccess = (obj: object) => isNonEmptyObject(obj);
const isError = (obj: object) => isNonEmptyObject(obj);

const onAddOrmUpdate = (update: { field: string; value: any }) => {
  if (update) {
    // console.log(`OrmAdd.onAddOrmUpdate emitting newObjectUpdate: ${JSON.stringify(update)}`);
    emit("newObjectUpdate", update);
  }
};

const onAddOrmSubmit = (submitted: any) => {
  if (submitted) {
    // console.log(`OrmAdd.onAddOrmSubmit emitting newObjectSubmit: ${JSON.stringify(submitted)}`);
    emit("newObjectSubmit", submitted);
  }
};

const onCancelOrmForm = (cancel: any) => {
  if (cancel) {
    // console.log(`OrmAdd.onCancelOrmForm emitting newObjectCancel: ${JSON.stringify(cancel)}`);
    emit("newObjectCancel");
  }
};

const addFormName = () => `add${props.typeDef.typeName}Form`;
const objectFields = () => props.typeDef.tabIndexedFields();

const addObjectError = ref(props.addObjectServerErrors);
watch(addObjectError, (newError: any) => {
  if (newError) {
    if (newError.errors) {
      errorSnackTimeout.value = -1;
      showErrorSnackbar.value = false;
    } else {
      // longer timeout for these kinds of things, more time to see the error
      errorSnackTimeout.value = 2 * SNACKBAR_ERROR_DEFAULT_TIMEOUT;
      showErrorSnackbar.value = true;
      showSuccessSnackbar.value = false;
    }
  } else {
    errorSnackTimeout.value = -1;
    showErrorSnackbar.value = false;
  }
});

// const addObjectSuccess = ref(props.addObjectSuccess);
// watch(addObjectSuccess, (ok) => {
//   if (ok) {
//     // longer timeout for these kinds of things, more time to see the message
//     // console.log(`OrmAdd.addObjectSuccess received: ${JSON.stringify(ok)}`);
//     successSnackTimeout.value = SNACKBAR_SUCCESS_DEFAULT_TIMEOUT;
//     showSuccessSnackbar.value = true;
//     showErrorSnackbar.value = false;
//   } else {
//     showSuccessSnackbar.value = false;
//     successSnackTimeout.value = -1;
//   }
// });
</script>
