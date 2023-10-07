<template>
  <v-container>
    <v-row>
      <v-col v-if="account">
        <ModelLibraryAdmin
            delete-confirmation-message="admin_label_confirm_library_delete"
            :label-prefixes="['admin_label_library_', 'label_media_', 'label_']"
            :action-configs="actionConfigs"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { timestampAsYYYYMMDDHHmmSS } from "zilla-util";
import { MobilettoOrmObject, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { LibraryScanType } from "yuebing-model";
import { useSessionStore } from "~/stores/sessionStore";
import { useLibraryScanStore } from "~/stores/model/libraryScanStore";
import ModelLibraryAdmin from "~/components/model/library/ModelLibraryAdmin.vue";
import { ActionConfig } from "~/utils/model/adminHelper";

const sessionStore = useSessionStore();
const { account } = storeToRefs(sessionStore);

const libraryScanStore = useLibraryScanStore();
const libraryScanServerErrors = ref({} as MobilettoOrmValidationErrors);

const actionConfigs: Record<string, ActionConfig> = {
  startScan: {
    func: async (obj: MobilettoOrmObject) => {
      console.log(`scan action func called with obj=${JSON.stringify(obj)}`);
      const scheduledTime = Date.now() + 5000;
      const scan: LibraryScanType = {
        scanId: `${timestampAsYYYYMMDDHHmmSS(scheduledTime)}-${obj.name}`,
        library: obj.name,
        status: "pending",
        scheduled: scheduledTime,
      };
      await libraryScanStore.create(scan, libraryScanServerErrors);
      navigateTo("/admin/libraryScan/admin");
    },
    message: 'admin_label_library_action_scan',
    icon: 'ScanIcon'
  }
};
</script>
