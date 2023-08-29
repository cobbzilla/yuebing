/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { DestinationTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "destination.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "destination.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof DestinationTypeDef.apiConfig.search?.validate === "function") {
        const validated = await DestinationTypeDef.apiConfig.search.validate(account, null, opts);
        if (validated === true || (typeof validated === "object" && Object.keys(validated).length === 0)) {
          // successfully validated
        } else if (typeof validated === "object" && Object.keys(validated).length > 0) {
          throw validationError(validated);
        } else {
          throw validationError({global: ["validation"]});
        }
      }
      const destinationRepo = destinationRepository();
      if (destinationRepo.initialize) await destinationRepo.initialize();
      const predicate = opts.textSearch && opts.textSearch.trim().length > 0
        ? (obj) => DestinationTypeDef.textMatch(obj, opts.textSearch || "")
        : undefined;
      const requestedOpts = opts.opts || {};
      const searchOpts = predicate ? Object.assign({}, requestedOpts, { predicate }) : requestedOpts;
      if (opts.field && opts.value) {
        return await destinationRepo.safeFindBy(opts.field, opts.value, searchOpts);
      } else {
        return await destinationRepo.find(searchOpts);
      }
    });
  });
});
