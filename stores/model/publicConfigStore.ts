// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { PublicConfigType } from "yuebing-model";
import { publicConfigService } from "~/utils/services/model/publicConfigService";

export const usePublicConfigStore = defineStore("publicConfig", {
  state: () => ({
    finding: false,
    found: null as PublicConfigType | null,
    creating: false,
    created: null as PublicConfigType | null,
    updating: false,
    updated: null as PublicConfigType | null,
    deleting: false,
    deleted: null as boolean | null,
  }),
  getters: {
      publicConfigBusy: (state) => state.finding || state.creating || state.updating || state.deleting,
  },
  actions: {
    async lookup(serverErrors?: Ref<MobilettoOrmValidationErrors>): Promise<PublicConfigType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await publicConfigService.findPublicConfig(serverErrors);
        return this.found
      } finally {
        this.finding = false;
      }
    },
    async search(): Promise<PublicConfigType[]> {
      return [await this.lookup()];
    },
    async create(object: PublicConfigType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<PublicConfigType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await publicConfigService.createPublicConfig(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: PublicConfigType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<PublicConfigType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await publicConfigService.updatePublicConfig(object, serverErrors);
        return this.updated;
      } finally {
        this.updating = false;
      }
    },
    async delete(serverErrors: Ref<MobilettoOrmValidationErrors>, purge?: boolean): Promise<boolean> {
      try {
        this.deleted = null;
        this.deleting = true;
        const deleteResult = await publicConfigService.deletePublicConfig(serverErrors, !!purge);
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
