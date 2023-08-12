// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { LocalConfigType } from "yuebing-model";
import { localConfigService } from "~/utils/services/model/localConfigService";

export const useLocalConfigStore = defineStore("localConfig", {
  state: () => ({
    finding: false,
    found: null as LocalConfigType | null,
    creating: false,
    created: null as LocalConfigType | null,
    updating: false,
    updated: null as LocalConfigType | null,
    deleting: false,
    deleted: null as boolean | null,
  }),
  getters: {
      localConfigBusy: (state) => state.finding || state.creating || state.updating || state.deleting,
  },
  actions: {
    async lookup(serverErrors?: Ref<MobilettoOrmValidationErrors>): Promise<LocalConfigType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await localConfigService.findLocalConfig(serverErrors);
        return this.found
      } finally {
        this.finding = false;
      }
    },
    async search(): Promise<LocalConfigType[]> {
      return [await this.lookup()];
    },
    async create(object: LocalConfigType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<LocalConfigType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await localConfigService.createLocalConfig(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: LocalConfigType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<LocalConfigType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await localConfigService.updateLocalConfig(object, serverErrors);
        return this.updated;
      } finally {
        this.updating = false;
      }
    },
    async delete(serverErrors: Ref<MobilettoOrmValidationErrors>, purge?: boolean): Promise<boolean> {
      try {
        this.deleted = null;
        this.deleting = true;
        const deleteResult = await localConfigService.deleteLocalConfig(serverErrors, !!purge);
        if (deleteResult) {
          this.deleted = true;
        } else {
          this.deleted = false;
        }
        return this.deleted;
      } finally {
        this.deleting = false;
      }
    },
  },
});
