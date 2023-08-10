/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { LibraryTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "library.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "library.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof LibraryTypeDef.apiConfig.search?.validate === "function") {
        const validated = await LibraryTypeDef.apiConfig.search.validate(account, null, opts);
        if (validated === true || (typeof validated === "object" && Object.keys(validated).length === 0)) {
          // successfully validated
        } else if (typeof validated === "object" && Object.keys(validated).length > 0) {
          throw validationError(validated);
        } else {
          throw validationError({global: ["validation"]});
        }
      }
      const libraryRepo = libraryRepository();
      if (opts.field && opts.value) {
        return await libraryRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && LibraryTypeDef.textSearchFields.length > 0) {
        return await libraryRepo.find({ predicate: (obj) => LibraryTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await libraryRepo.find(opts.opts || {});
      }
    });
  });
});
