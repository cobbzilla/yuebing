/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { PublicConfigTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "publicConfig.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "publicConfig.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = {}; // publicConfig is a singleton, options make no sense
      const publicConfigRepo = publicConfigRepository();
      const singleton = await publicConfigRepo.safeFindById("public");
      return singleton ? [ singleton ] : [];
    });
  });
});