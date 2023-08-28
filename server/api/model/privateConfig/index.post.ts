/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { PrivateConfigTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "privateConfig.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "privateConfig.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = {}; // privateConfig is a singleton, options make no sense
      const privateConfigRepo = privateConfigRepository();
      if (privateConfigRepo.initialize) await privateConfigRepo.initialize();
      const singleton = await privateConfigRepo.safeFindById("private");
      return singleton ? [ singleton ] : [];
    });
  });
});
