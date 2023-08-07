/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { DestinationTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "~/utils/search";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "destination.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "destination.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      const destinationRepo = destinationRepository();
      if (opts.field && opts.value) {
        return await destinationRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && DestinationTypeDef.textSearchFields.length > 0) {
        return await destinationRepo.find({ predicate: (obj) => DestinationTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await destinationRepo.find(opts.opts || {});
      }
    });
  });
});
