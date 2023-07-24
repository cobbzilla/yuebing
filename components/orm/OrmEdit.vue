<template>
  <v-container>
    <v-row v-if="showSuccessSnackbar && isSuccess(editObjectSuccess)">
      <v-col>
        <v-snackbar v-model="showSuccessSnackbar" :timeout="successSnackTimeout" color="success" centered>
          <h4>
            snackbar:
            {{
              msg(editObjectSuccessMessage, {
                id: (editObjectSuccess as MobilettoOrmObject)[typeDef.idField(editObjectSuccess) as string],
                type: messages[typeNameMessage],
              })
            }}
          </h4>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="showErrorSnackbar && isError(editObjectError)">
      <v-col>
        <v-snackbar v-model="showErrorSnackbar" :timeout="errorSnackTimeout" color="error" centered>
          <h4>
            {{
              msg(editObjectErrorMessage, {
                type: messages[typeNameMessage],
                error: `${editObjectError ?? "undefined"}`,
              })
            }}
          </h4>
          <small>
            <vue-json-pretty
              :data="JSON.stringify(editObjectError)"
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
        <h4>{{ msg(editObjectMessage, { type: messages[typeNameMessage] }) }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <OrmForm
          :form-name="editFormName"
          :type-def="typeDef"
          :type-name-message="typeNameMessage"
          :thing="localObject"
          :read-only-object="readOnlyObject"
          save-button-message="admin_button_edit"
          :fields="objectFields"
          :create="false"
          :submitted="objectSubmitted"
          :success-event="editObjectSuccess"
          :server-errors="editObjectError"
          :label-prefixes="labelPrefixes"
          @update="onEditOrmUpdate"
          @submitted="onEditOrmSubmit"
          @cancel="onCancelOrmForm"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { MobilettoOrmObject, MobilettoOrmTypeDef, ValidationErrors } from "mobiletto-orm";
import { findMessage, parseMessage } from "yuebing-messages";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { useSessionStore } from "~/stores/session";
import { SNACKBAR_ERROR_DEFAULT_TIMEOUT, SNACKBAR_SUCCESS_DEFAULT_TIMEOUT } from "~/utils/ui";

const props = withDefaults(
  defineProps<{
    typeDef: MobilettoOrmTypeDef;
    typeNameMessage: string;
    labelPrefixes: string[];

    targetObject: MobilettoOrmObject;
    readOnlyObject: () => boolean;

    objectSubmitted: boolean;
    editObjectMessage: string;
    editObjectSuccess: MobilettoOrmObject;
    editObjectError: ValidationErrors;
    editObjectSuccessMessage: string;
    editObjectErrorMessage: string;
  }>(),
  {
    labelPrefixes: () => ["label_"],
    objectSubmitted: () => false,
    editObjectMessage: () => "admin_button_edit",
    editObjectSuccessMessage: () => "admin_info_edited",
    editObjectErrorMessage: () => "admin_info_edit_error",
  },
);

const emit = defineEmits<{
  editObjectUpdate: [update: { field: string; value: any }];
  editObjectSubmit: [thing: MobilettoOrmObject];
  editObjectCancel: [];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);
const msg = (key: string, ctx: Record<string, unknown>) =>
  parseMessage(findMessage(key, messages.value, props.labelPrefixes), messages.value, ctx);

const localObject = ref(structuredClone(props.targetObject));

const showSuccessSnackbar = ref(false);
const successSnackTimeout = ref(-1);
const showErrorSnackbar = ref(false);
const errorSnackTimeout = ref(-1);

const isNonEmptyObject = (obj: object) => obj && typeof obj === "object" && Object.keys(obj).length > 0;
const isSuccess = (obj: object) => isNonEmptyObject(obj);
const isError = (obj: object) => isNonEmptyObject(obj);

const onEditOrmUpdate = (update: { field: string; value: any }) => {
  if (update) {
    // console.log(`OrmEdit.onEditOrmUpdate emitting newObjectUpdate: ${JSON.stringify(update)}`);
    emit("editObjectUpdate", update);
  }
};

const onEditOrmSubmit = (submitted: any) => {
  if (submitted) {
    // console.log(`OrmEdit.onEditOrmSubmit emitting newObjectSubmit: ${JSON.stringify(submitted)}`);
    emit("editObjectSubmit", submitted);
  }
};

const onCancelOrmForm = (cancel: any) => {
  if (cancel) {
    // console.log(`OrmEdit.onCancelOrmForm emitting newObjectCancel: ${JSON.stringify(cancel)}`);
    emit("editObjectCancel");
  }
};

const editFormName = () => `edit${props.typeDef.typeName}Form`;
const objectFields = () => props.typeDef.tabIndexedFields();

const editObjectError = ref(props.editObjectError);
watch(editObjectError, (newError: any) => {
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

const editObjectSuccess = ref(props.editObjectSuccess);
watch(editObjectSuccess, (ok) => {
  if (ok) {
    // longer timeout for these kinds of things, more time to see the message
    // console.log(`OrmEdit.editObjectSuccess received: ${JSON.stringify(ok)}`);
    successSnackTimeout.value = SNACKBAR_SUCCESS_DEFAULT_TIMEOUT;
    showSuccessSnackbar.value = true;
    showErrorSnackbar.value = false;
  } else {
    showSuccessSnackbar.value = false;
    successSnackTimeout.value = -1;
  }
});
</script>
