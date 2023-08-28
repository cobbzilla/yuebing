/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { ProfileJobTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "profileJob.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "profileJob.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof ProfileJobTypeDef.apiConfig.search?.validate === "function") {
        const validated = await ProfileJobTypeDef.apiConfig.search.validate(account, null, opts);
        if (validated === true || (typeof validated === "object" && Object.keys(validated).length === 0)) {
          // successfully validated
        } else if (typeof validated === "object" && Object.keys(validated).length > 0) {
          throw validationError(validated);
        } else {
          throw validationError({global: ["validation"]});
        }
      }
      const profileJobRepo = profileJobRepository();
      if (profileJobRepo.initialize) await profileJobRepo.initialize();
      if (opts.field && opts.value) {
        return await profileJobRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && ProfileJobTypeDef.textSearchFields.length > 0) {
        return await profileJobRepo.find({ predicate: (obj) => ProfileJobTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await profileJobRepo.find(opts.opts || {});
      }
    });
  });
});
