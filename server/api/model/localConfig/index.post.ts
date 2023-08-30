/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmObject } from "mobiletto-orm-typedef";
import { LocalConfigTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "~/utils/model/storeHelper";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "localConfig.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "localConfig.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = {}; // localConfig is a singleton, options make no sense
      const localConfigRepo = localConfigRepository();
      if (localConfigRepo.initialize) await localConfigRepo.initialize();
      const singleton = await localConfigRepo.safeFindById("local");
      return singleton ? [ singleton ] : [];
    });
  });
});
