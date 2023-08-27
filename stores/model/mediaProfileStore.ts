// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { MediaProfileType, MediaProfileTypeDef } from "yuebing-model";
import { mediaProfileService } from "~/utils/services/model/mediaProfileService";
import { MobilettoOrmFindApiOpts, updateOrmList } from "~/utils/model/storeHelper.js";

const updateList = (list: MediaProfileType[] | null, id: string, opts?: { object?: MediaProfileType; remove?: boolean }) => {
  return updateOrmList<MediaProfileType>(MediaProfileTypeDef, list, id, opts);
};

export const useMediaProfileStore = defineStore("mediaProfile", {
  state: () => ({
    finding: false,
    found: null as MediaProfileType | null,
    creating: false,
    created: null as MediaProfileType | null,
    updating: false,
    updated: null as MediaProfileType | null,
    deleting: false,
    deleted: null as boolean | null,
    searching: false,
    mediaProfileList: null as MediaProfileType[] | null,
  }),
  getters: {
      mediaProfileBusy: (state) => state.finding || state.creating || state.updating || state.deleting || state.searching,
  },
  actions: {
    async lookup(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<MediaProfileType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await mediaProfileService.findMediaProfile(id, serverErrors);
        if (this.found) {
          updateList(this.mediaProfileList, MediaProfileTypeDef.id(this.found), {object: this.found});
        }
        return this.found;
      } finally {
        this.finding = false;
      }
    },
    async search(query?: MobilettoOrmFindApiOpts): Promise<MediaProfileType[]> {
      try {
        this.searching = true;
        this.mediaProfileList = await mediaProfileService.searchMediaProfile(query);
        return this.mediaProfileList || [];
      } finally {
        this.searching = false;
      }
    },
    async create(object: MediaProfileType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<MediaProfileType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await mediaProfileService.createMediaProfile(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: MediaProfileType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<MediaProfileType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await mediaProfileService.updateMediaProfile(object, serverErrors);
        if (this.updated) {
          updateList(this.mediaProfileList, MediaProfileTypeDef.id(this.updated), {object: this.updated});
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
        const deleteResult = await mediaProfileService.deleteMediaProfile(id, serverErrors, !!purge);
        if (deleteResult) {
          updateList(this.mediaProfileList, id, { remove: true });
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
