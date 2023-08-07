/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { SourceTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "~/utils/search";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "source.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "source.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      const sourceRepo = sourceRepository();
      if (opts.field && opts.value) {
        return await sourceRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && SourceTypeDef.textSearchFields.length > 0) {
        return await sourceRepo.find({ predicate: (obj) => SourceTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await sourceRepo.find(opts.opts || {});
      }
    });
  });
});
