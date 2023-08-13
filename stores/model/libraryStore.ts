// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { LibraryType, LibraryTypeDef } from "yuebing-model";
import { libraryService } from "~/utils/services/model/libraryService";
import { MobilettoOrmFindApiOpts, updateOrmList } from "~/utils/model/storeHelper.js";

const updateList = (list: LibraryType[] | null, id: string, opts?: { object?: LibraryType; remove?: boolean }) => {
  return updateOrmList<LibraryType>(LibraryTypeDef, list, id, opts);
};

export const useLibraryStore = defineStore("library", {
  state: () => ({
    finding: false,
    found: null as LibraryType | null,
    creating: false,
    created: null as LibraryType | null,
    updating: false,
    updated: null as LibraryType | null,
    deleting: false,
    deleted: null as boolean | null,
    searching: false,
    libraryList: null as LibraryType[] | null,
  }),
  getters: {
      libraryBusy: (state) => state.finding || state.creating || state.updating || state.deleting || state.searching,
  },
  actions: {
    async lookup(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<LibraryType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await libraryService.findLibrary(id, serverErrors);
        if (this.found) {
          updateList(this.libraryList, LibraryTypeDef.id(this.found), {object: this.found});
        }
        return this.found;
      } finally {
        this.finding = false;
      }
    },
    async search(query?: MobilettoOrmFindApiOpts): Promise<LibraryType[]> {
      try {
        this.searching = true;
        this.libraryList = await libraryService.searchLibrary(query);
        return this.libraryList || [];
      } finally {
        this.searching = false;
      }
    },
    async create(object: LibraryType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<LibraryType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await libraryService.createLibrary(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: LibraryType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<LibraryType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await libraryService.updateLibrary(object, serverErrors);
        if (this.updated) {
          updateList(this.libraryList, LibraryTypeDef.id(this.updated), {object: this.updated});
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
        const deleteResult = await libraryService.deleteLibrary(id, serverErrors, !!purge);
        if (deleteResult) {
          updateList(this.libraryList, id, { remove: true });
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
