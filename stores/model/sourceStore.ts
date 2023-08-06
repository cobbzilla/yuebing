// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { SourceType, SourceTypeDef } from "yuebing-model";
import { sourceService } from "~/utils/services/model/sourceService";
import { MobilettoOrmFindApiOpts } from "~/utils/search";
import { updateOrmList } from "~/utils/orm";

const updateList = (list: SourceType[] | null, id: string, opts?: { object?: SourceType; remove?: boolean }) => {
  return updateOrmList<SourceType>(SourceTypeDef, list, id, opts);
};

export const useSourceStore = defineStore("source", {
  state: () => ({
    finding: false,
    found: null as SourceType | null,
    creating: false,
    created: null as SourceType | null,
    updating: false,
    updated: null as SourceType | null,
    deleting: false,
    deleted: null as boolean | null,
    searching: false,
    sourceList: null as SourceType[] | null,
  }),
  getters: {
      sourceBusy: (state) => state.finding || state.creating || state.updating || state.deleting || state.searching,
  },
  actions: {
    async lookup(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<SourceType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await sourceService.findSource(id, serverErrors);
        if (this.found) {
          updateList(this.sourceList, SourceTypeDef.id(this.found), {object: this.found});
        }
        return this.found;
      } finally {
        this.finding = false;
      }
    },
    async search(query?: MobilettoOrmFindApiOpts): Promise<SourceType[]> {
      try {
        this.searching = true;
        this.sourceList = await sourceService.searchSource(query);
        return this.sourceList || [];
      } finally {
        this.searching = false;
      }
    },
    async create(object: SourceType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<SourceType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await sourceService.createSource(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: SourceType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<SourceType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await sourceService.updateSource(object, serverErrors);
        if (this.updated) {
          updateList(this.sourceList, SourceTypeDef.id(this.updated), {object: this.updated});
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
        const deleteResult = await sourceService.deleteSource(id, serverErrors, !!purge);
        if (deleteResult) {
          updateList(this.sourceList, id, { remove: true });
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
