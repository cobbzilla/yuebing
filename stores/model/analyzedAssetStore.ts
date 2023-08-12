// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { AnalyzedAssetType, AnalyzedAssetTypeDef } from "yuebing-model";
import { analyzedAssetService } from "~/utils/services/model/analyzedAssetService";
import { MobilettoOrmFindApiOpts, updateOrmList } from "~/utils/model/storeHelper.js";

const updateList = (list: AnalyzedAssetType[] | null, id: string, opts?: { object?: AnalyzedAssetType; remove?: boolean }) => {
  return updateOrmList<AnalyzedAssetType>(AnalyzedAssetTypeDef, list, id, opts);
};

export const useAnalyzedAssetStore = defineStore("analyzedAsset", {
  state: () => ({
    finding: false,
    found: null as AnalyzedAssetType | null,
    creating: false,
    created: null as AnalyzedAssetType | null,
    updating: false,
    updated: null as AnalyzedAssetType | null,
    deleting: false,
    deleted: null as boolean | null,
    searching: false,
    analyzedAssetList: null as AnalyzedAssetType[] | null,
  }),
  getters: {
      analyzedAssetBusy: (state) => state.finding || state.creating || state.updating || state.deleting || state.searching,
  },
  actions: {
    async lookup(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AnalyzedAssetType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await analyzedAssetService.findAnalyzedAsset(id, serverErrors);
        if (this.found) {
          updateList(this.analyzedAssetList, AnalyzedAssetTypeDef.id(this.found), {object: this.found});
        }
        return this.found;
      } finally {
        this.finding = false;
      }
    },
    async search(query?: MobilettoOrmFindApiOpts): Promise<AnalyzedAssetType[]> {
      try {
        this.searching = true;
        this.analyzedAssetList = await analyzedAssetService.searchAnalyzedAsset(query);
        return this.analyzedAssetList || [];
      } finally {
        this.searching = false;
      }
    },
    async create(object: AnalyzedAssetType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AnalyzedAssetType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await analyzedAssetService.createAnalyzedAsset(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: AnalyzedAssetType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AnalyzedAssetType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await analyzedAssetService.updateAnalyzedAsset(object, serverErrors);
        if (this.updated) {
          updateList(this.analyzedAssetList, AnalyzedAssetTypeDef.id(this.updated), {object: this.updated});
        }
        return this.updated;
      } finally {
        this.updating = false;
      }
    },
    async delete(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>, purge?: boolean): Promise<boolean> {
      try {
        this.deleted = null;
        this.deleting = true;
        const deleteResult = await analyzedAssetService.deleteAnalyzedAsset(id, serverErrors, !!purge);
        if (deleteResult) {
          updateList(this.analyzedAssetList, id, { remove: true });
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