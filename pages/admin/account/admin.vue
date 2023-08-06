<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelAccountAdmin
            delete-confirmation-message="admin_label_confirm_account_delete"
            :can-delete="checkCannotDeleteSelf"
            :filter-object="setUpdatableFalseIfSelf"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { MobilettoOrmObject } from "mobiletto-orm-typedef";
import { AccountTypeDef } from "yuebing-model";
import { useSessionStore } from "~/stores/session";
import ModelAccountAdmin from "~/components/model/account/ModelAccountAdmin.vue";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);

const isSelf = (obj: MobilettoOrmObject) => account && account.value && AccountTypeDef.id(obj) === AccountTypeDef.id(account.value);

const checkCannotDeleteSelf = (obj: MobilettoOrmObject) => !isSelf(obj);
</script>
