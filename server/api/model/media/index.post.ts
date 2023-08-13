/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MediaTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "media.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "media.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof MediaTypeDef.apiConfig.search?.validate === "function") {
        const validated = await MediaTypeDef.apiConfig.search.validate(account, null, opts);
        if (validated === true || (typeof validated === "object" && Object.keys(validated).length === 0)) {
          // successfully validated
        } else if (typeof validated === "object" && Object.keys(validated).length > 0) {
          throw validationError(validated);
        } else {
          throw validationError({global: ["validation"]});
        }
      }
      const mediaRepo = mediaRepository();
      if (opts.field && opts.value) {
        return await mediaRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && MediaTypeDef.textSearchFields.length > 0) {
        return await mediaRepo.find({ predicate: (obj) => MediaTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await mediaRepo.find(opts.opts || {});
      }
    });
  });
});
