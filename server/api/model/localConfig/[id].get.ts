/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { DEFAULT_LOCAL_CONFIG } from "~/server/utils/default";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "localConfig.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "localConfig.lookup", async (event: H3Event, session, account) => {
      const localConfigRepo = localConfigRepository();
      const id = "local"; // localConfig is a singleton: there can be only one, with id "local"
      if (!id) throw notFound(localConfigRepo.typeDef.idFieldName());
      const localConfig_by_id = await localConfigRepo.safeFindById(id);
      if (localConfig_by_id) return localConfig_by_id;
      return DEFAULT_LOCAL_CONFIG;
    });
  });
});