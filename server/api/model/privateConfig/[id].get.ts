/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { DEFAULT_PRIVATE_CONFIG } from "~/server/utils/default";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "privateConfig.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "privateConfig.lookup", async (event: H3Event, session, account) => {
      const privateConfigRepo = privateConfigRepository();
      const id = "private"; // privateConfig is a singleton: there can be only one, with id "private"
      if (!id) throw notFound(privateConfigRepo.typeDef.idFieldName());
      const privateConfig_by_id = await privateConfigRepo.safeFindById(id);
      if (privateConfig_by_id) return privateConfig_by_id;
      return DEFAULT_PRIVATE_CONFIG;
    });
  });
});
