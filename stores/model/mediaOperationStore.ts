// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { MediaOperationType, MediaOperationTypeDef } from "yuebing-model";
import { mediaOperationService } from "~/utils/services/model/mediaOperationService";
import { MobilettoOrmFindApiOpts, updateOrmList } from "~/utils/model/storeHelper.js";

const updateList = (list: MediaOperationType[] | null, id: string, opts?: { object?: MediaOperationType; remove?: boolean }) => {
  return updateOrmList<MediaOperationType>(MediaOperationTypeDef, list, id, opts);
};

export const useMediaOperationStore = defineStore("mediaOperation", {
  state: () => ({
    finding: false,
    found: null as MediaOperationType | null,
    creating: false,
    created: null as MediaOperationType | null,
    updating: false,
    updated: null as MediaOperationType | null,
    deleting: false,
    deleted: null as boolean | null,
    searching: false,
    mediaOperationList: null as MediaOperationType[] | null,
  }),
  getters: {
      mediaOperationBusy: (state) => state.finding || state.creating || state.updating || state.deleting || state.searching,
  },
  actions: {
    async lookup(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<MediaOperationType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await mediaOperationService.findMediaOperation(id, serverErrors);
        if (this.found) {
          updateList(this.mediaOperationList, MediaOperationTypeDef.id(this.found), {object: this.found});
        }
        return this.found;
      } finally {
        this.finding = false;
      }
    },
    async search(query?: MobilettoOrmFindApiOpts): Promise<MediaOperationType[]> {
      try {
        this.searching = true;
        this.mediaOperationList = await mediaOperationService.searchMediaOperation(query);
        return this.mediaOperationList || [];
      } finally {
        this.searching = false;
      }
    },
    async create(object: MediaOperationType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<MediaOperationType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await mediaOperationService.createMediaOperation(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: MediaOperationType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<MediaOperationType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await mediaOperationService.updateMediaOperation(object, serverErrors);
        if (this.updated) {
          updateList(this.mediaOperationList, MediaOperationTypeDef.id(this.updated), {object: this.updated});
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
        const deleteResult = await mediaOperationService.deleteMediaOperation(id, serverErrors, !!purge);
        if (deleteResult) {
          updateList(this.mediaOperationList, id, { remove: true });
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
