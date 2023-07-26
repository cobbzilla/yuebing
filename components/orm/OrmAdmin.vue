<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>{{ messages[typeAdminMessage] }}</h2>
      </v-col>
    </v-row>
    <v-row v-if="addingObject">
      <v-col>
        <OrmAdd
          :type-def="typeDef"
          :type-name-message="typeNameMessage"
          :label-prefixes="labelPrefixes"
          :add-object-object="addObjectObject"
          :object-submitted="objectSubmitted"
          :add-object-message="addObjectMessage"
          :add-object-error="addObjectError"
          :add-object-error-message="addObjectErrorMessage"
          :add-object-success-message="addObjectSuccessMessage"
          @new-object-update="onNewObjectUpdate"
          @new-object-submit="onNewObjectSubmit"
          @new-object-cancel="onNewObjectCancel"
        />
      </v-col>
    </v-row>
    <v-row v-else-if="editingObject">
      <OrmEdit
        :type-def="typeDef"
        :type-name-message="typeNameMessage"
        :label-prefixes="labelPrefixes"
        :target-object="editingObject"
        :read-only-object="readOnlyObject"
        :object-submitted="objectSubmitted"
        :edit-object-message="editObjectMessage"
        :edit-object-error="editObjectError"
        :edit-object-error-message="editObjectErrorMessage"
        :edit-object-success-message="editObjectSuccessMessage"
        @edit-object-submit="onEditObjectSubmit"
        @edit-object-cancel="onEditObjectCancel"
      />
    </v-row>
    <v-row v-else>
      <v-col>
        <v-container>
          <v-row v-if="totalObjectCount > 0">
            <v-col>
              <div>
                <ValidationObserver ref="form">
                  <v-form @submit.prevent="searchObjects">
                    <ValidationProvider v-slot="{ errors }" name="searchTerms" rules="max:200" immediate>
                      <div class="form-group">
                        <v-text-field
                          v-model="searchTerms"
                          :label="messages.label_search"
                          type="text"
                          name="searchTerms"
                          class="form-control"
                          :error="errors.length > 0"
                          :error-messages="fieldError('searchTerms', errors)"
                          @keyup.enter="searchObjects"
                        />
                        <v-btn class="btn btn-primary" :disabled="findingObjects" @click.stop="searchObjects">
                          {{ messages.button_search }}
                        </v-btn>
                      </div>
                    </ValidationProvider>
                  </v-form>
                </ValidationObserver>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <table v-if="objectList && objectList.length > 0">
                <thead>
                  <tr>
                    <th v-for="(tableField, tableFieldIndex) in tableFields" :key="tableFieldIndex">
                      {{ tableFieldMessages[tableField] }}
                    </th>
                    <th>
                      {{ messages.admin_label_actions }}
                    </th>
                    <th>{{ msg(editObjectMessage, { type: messages[typeNameMessage] }) }}</th>
                    <th>{{ msg(deleteObjectMessage, { type: messages[typeNameMessage] }) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(obj, objIndex) in objectList" :key="objIndex">
                    <td v-for="(fieldName, fieldIndex) in tableFields" :key="fieldIndex">
                      <OrmFieldDisplay :field="typeDef.fields[fieldName]" :value="obj[fieldName]" />
                    </td>
                    <td>
                      <div v-for="(action, actionIndex) in Object.keys(actionConfigs)" :key="actionIndex">
                        <NuxtLink
                          v-if="actionEnabled(obj, action)"
                          :to="{ path: `${actionConfig(action).path}/${obj[typeDef.idField(obj)]}` }"
                        >
                          <v-btn>
                            {{ messages[actionConfig(action).message] }}
                          </v-btn>
                        </NuxtLink>
                      </div>
                    </td>
                    <td>
                      <v-btn v-if="canEdit(obj)" :disabled="objectOperationInProgress" @click.stop="showEditOrm(obj)">
                        {{
                          msg(readOnlyObject(obj) ? viewObjectMessage : editObjectMessage, {
                            type: messages[typeNameMessage],
                          })
                        }}
                      </v-btn>
                    </td>
                    <td>
                      <v-btn v-if="canDelete(obj)" :disabled="objectOperationInProgress" @click.stop="delObject(obj)">
                        {{ msg(deleteObjectMessage, { type: messages[typeNameMessage] }) }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn class="btn btn-primary" :disabled="findingObjects" @click.stop="showAddOrm">
                {{ msg(addObjectMessage, { type: messages[typeNameMessage] }) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import "vue-json-pretty/lib/styles.css";
import { MobilettoOrmObject, MobilettoOrmTypeDef, MobilettoOrmValidationErrors } from "mobiletto-orm";
import { fieldErrorMessage, findMessage, parseMessage } from "yuebing-messages";
import { storeToRefs } from "pinia";
import { useSessionStore } from "~/stores/session";

const JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION = 3;

type ActionConfig = {
  when: (obj: MobilettoOrmObject) => boolean;
};

const props = withDefaults(
  defineProps<{
    typeDef: MobilettoOrmTypeDef;
    typeAdminMessage: string;
    typeNameMessage: string;
    labelPrefixes: string[];
    objectList: MobilettoOrmObject[];
    actionConfigs: Record<string, ActionConfig>;
    totalObjectCount: number;
    addObjectObject: MobilettoOrmObject;
    addObjectMessage: string;
    addObjectError: MobilettoOrmValidationErrors;
    addObjectSuccessMessage: string;
    addObjectErrorMessage: string;
    readOnlyObject: () => boolean;
    viewObjectMessage: string;
    editObjectMessage: string;
    editObjectError: MobilettoOrmValidationErrors;
    editObjectSuccessMessage: string;
    editObjectErrorMessage: string;
    canEdit: () => boolean;
    canDelete: () => boolean;
    deleteObjectMessage: string;
    deleteObjectSuccess: object;
    deleteObjectError: object; // ValidationErrors?
    deleteConfirmationMessage: string;
    objectSubmitted: boolean;
    objectOperationInProgress: boolean;
  }>(),
  {
    labelPrefixes: () => ["label_"],
    objectList: () => [],
    actionConfigs: () => ({}),
    totalObjectCount: () => 0,
    addObjectMessage: () => "admin_button_add",
    addObjectSuccessMessage: () => "admin_info_added",
    addObjectErrorMessage: () => "admin_info_add_error",
    viewObjectMessage: () => "admin_button_view",
    editObjectMessage: () => "admin_button_edit",
    editObjectSuccessMessage: () => "admin_info_edited",
    editObjectErrorMessage: () => "admin_info_edit_error",
    deleteObjectMessage: () => "admin_button_delete",
    objectSubmitted: () => false,
  },
);

type QueryType = {
  pageNumber?: number;
  pageSize?: number;
  searchTerms?: string;
};

const emit = defineEmits<{
  query: [q: QueryType];
  newObjectUpdate: [obj: { field: string; value: any }];
  newObjectSubmit: [obj: MobilettoOrmObject];
  editObjectStart: [obj: MobilettoOrmObject];
  editObjectSubmit: [obj: MobilettoOrmObject];
  deleteObject: [obj: MobilettoOrmObject];
}>();

const session = storeToRefs(useSessionStore());
const messages = ref(session.localeMessages);
const msg = (key: string, ctx: Record<string, unknown>) => parseMessage(messages.value[key], messages.value, ctx);

const pageNumber = ref(1);
const pageSize = ref(20);
const searchTerms = ref("");
const lastQuery = ref({});
const deleteConfirmCount = ref(0);
const addingObject = ref(false);
const findingObjects = ref(false);
const editingObject = ref({});

// const addFormName = () => `add${props.typeDef.typeName}Form`;
// const objectFields = () => props.typeDef.tabIndexedFields();

const searchQuery = () => ({
  pageNumber: pageNumber.value,
  pageSize: pageSize.value,
  searchTerms: searchTerms.value,
});

const tableFields = () =>
  props.typeDef.tableFields && Array.isArray(props.typeDef.tableFields)
    ? props.typeDef.tableFields
    : props.typeDef.primary
    ? [props.typeDef.primary, "ctime", "mtime"]
    : ["id", "ctime", "mtime"];

const tableFieldMessages = () => {
  const defaultTableFieldMessages: Record<string, string> = {};
  tableFields().forEach((f) => {
    defaultTableFieldMessages[f] = findMessage(f, messages.value, props.labelPrefixes);
  });
  return defaultTableFieldMessages;
};

// const isNonEmptyObject = (obj: object) => obj && typeof obj === "object" && Object.keys(obj).length > 0;
// const isSuccess = (obj: object) => isNonEmptyObject(obj);
// const isError = (obj: object) => isNonEmptyObject(obj);

const fieldError = (field: string, error: any, labelPrefix = "label_") => {
  return field && error ? fieldErrorMessage(field, error, messages.value, labelPrefix) : "(no message)";
};

const searchObjects = () => {
  if (lastQuery.value && JSON.stringify(lastQuery.value) === JSON.stringify(searchQuery())) {
    // console.log("not sending duplicate search");
  } else {
    const query = searchQuery();
    lastQuery.value = Object.assign({}, query);
    // console.log(`searchObjects: emitting query: ${JSON.stringify(query)}`);
    findingObjects.value = true;
    emit("query", query);
  }
};

const actionConfig = (action: string) => {
  return props.actionConfigs[action];
};

const actionEnabled = (obj: MobilettoOrmObject, action: string) => {
  const cfg = props.actionConfigs[action];
  if (!cfg.when || typeof cfg.when !== "function") {
    return true;
  }
  if (typeof cfg.when === "function") {
    return cfg.when(obj) === true;
  }
  return true;
};

const onNewObjectUpdate = (update: { field: string; value: any }) => {
  emit("newObjectUpdate", update);
};
const onNewObjectSubmit = (update: MobilettoOrmObject) => {
  emit("newObjectSubmit", update);
};
const showAddOrm = () => {
  addingObject.value = true;
};
const onNewObjectCancel = () => {
  addingObject.value = false;
};

const onEditObjectSubmit = (update: MobilettoOrmObject) => {
  emit("editObjectSubmit", update);
};

const showEditOrm = (obj: MobilettoOrmObject) => {
  if (editingObject.value) {
    // already editing something else
    return;
  }
  if (obj) {
    const id = props.typeDef.id(obj);
    if (id && id.length > 0) {
      editingObject.value = structuredClone(obj);
      emit("editObjectStart", editingObject.value);
    }
  }
};
const onEditObjectCancel = () => {
  editingObject.value = {};
};

const delObject = (obj: MobilettoOrmObject) => {
  if (
    deleteConfirmCount.value > JUST_STOP_ASKING_ABOUT_CONFIRMING_DELETION ||
    confirm(
      msg(props.deleteConfirmationMessage, {
        id: obj ? obj[props.typeDef.idField(obj) as string] : null,
      }),
    )
  ) {
    deleteConfirmCount.value++;
    emit("deleteObject", obj);
  } else {
    deleteConfirmCount.value = 0;
  }
};

const objectList = ref(props.objectList);
watch(objectList, (newList) => {
  if (newList && Array.isArray(newList)) {
    findingObjects.value = false;
  }
});
// const addObjectSuccess = ref(props.addObjectSuccess);
// watch(addObjectSuccess, (success) => {
//   if (success && typeof success === "object" && Object.keys(success).length > 0) {
//     addingObject.value = false;
//     searchObjects();
//   }
// });
// const editObjectSuccess = ref(props.editObjectSuccess);
// watch(editObjectSuccess, (success) => {
//   if (success && typeof success === "object" && Object.keys(success).length > 0) {
//     editingObject.value = {};
//     searchObjects();
//   }
// });

searchObjects();
</script>
