// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { defineStore } from "pinia";
import { LibraryType, LibraryTypeDef } from "yuebing-model";
import { libraryService } from "~/utils/services/model/libraryService";

const updateList = (list: LibraryType[] | null, id: string, opts?: { library?: LibraryType, remove?: boolean }) => {
  if (!opts) return;
  if (list) {
    const foundIndex = list.findIndex((e) => LibraryTypeDef.id(e) === id);
    if (foundIndex && foundIndex >= 0) {
      if (opts && opts.remove === true) {
        list.splice(foundIndex, 1);
      } else if (opts && opts.library) {
        list.splice(foundIndex, 1, opts.library);
      }
    }
  }
};

export const useLibraryStore = defineStore("library", {
  state: () => ({
    library: null as LibraryType | null,
    libraryList: null as LibraryType[] | null,
  }),
  actions: {
    async libraryLookup(id: string): Promise<LibraryType> {
      this.library = await libraryService.findLibrary(id);
      updateList(this.libraryList, LibraryTypeDef.id(this.library), { library: this.library });
      return this.library;
    },
    async librarySearch(query?: MobilettoOrmFindApiOpts): Promise<LibraryType[]> {
      this.libraryList = await libraryService.searchLibrary(query);
      return this.libraryList || [];
    },
    async libraryCreate(library: LibraryType): Promise<LibraryType> {
      this.library = await libraryService.createLibrary(library);
      return this.library;
    },
    async libraryUpdate(library: LibraryType): Promise<LibraryType> {
      this.library = await libraryService.updateLibrary(library);
      updateList(this.libraryList, LibraryTypeDef.id(this.library), { library: this.library });
      return this.library;
    },
    async libraryDelete(library: string): Promise<boolean> {
      await libraryService.deleteLibrary(library);
      updateList(this.libraryList, library, { remove: true });
      return true;
    },
  },
});