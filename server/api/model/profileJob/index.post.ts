/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmObject } from "mobiletto-orm-typedef";
import { ProfileJobTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "~/utils/model/storeHelper";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "profileJob.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "profileJob.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof ProfileJobTypeDef.apiConfig.search?.validate === "function") {
        const caller = (typeof account !== "undefined") ? account : undefined;
        const validated = await ProfileJobTypeDef.apiConfig.search.validate(caller, null, opts);
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
      const predicate = opts.textSearch && opts.textSearch.trim().length > 0
        ? (obj: MobilettoOrmObject) => ProfileJobTypeDef.textMatch(obj, opts.textSearch || "")
        : undefined;
      const requestedOpts = opts.opts || {};
      const searchOpts = predicate ? Object.assign({}, requestedOpts, { predicate }) : requestedOpts;
      if (opts.field && opts.value) {
        return await profileJobRepo.safeFindBy(opts.field, opts.value, searchOpts);
      } else {
        return await profileJobRepo.find(searchOpts);
      }
    });
  });
});
