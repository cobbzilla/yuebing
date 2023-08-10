/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { AccountTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "account.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "account.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof AccountTypeDef.apiConfig.search?.validate === "function") {
        const validated = await AccountTypeDef.apiConfig.search.validate(account, null, opts);
        if (validated === true || (typeof validated === "object" && Object.keys(validated).length === 0)) {
          // successfully validated
        } else if (typeof validated === "object" && Object.keys(validated).length > 0) {
          throw validationError(validated);
        } else {
          throw validationError({global: ["validation"]});
        }
      }
      const accountRepo = accountRepository();
      if (opts.field && opts.value) {
        return await accountRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && AccountTypeDef.textSearchFields.length > 0) {
        return await accountRepo.find({ predicate: (obj) => AccountTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await accountRepo.find(opts.opts || {});
      }
    });
  });
});
