/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "publicConfig.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "publicConfig.lookup", async (event: H3Event, session, account) => {
      const publicConfigRepo = publicConfigRepository();
      const id = "public"; // publicConfig is a singleton: there can be only one, with id "public"
      if (!id) throw notFound(publicConfigRepo.typeDef.idFieldName());
      const publicConfig_by_id = await publicConfigRepo.safeFindById(id);
      if (publicConfig_by_id) return publicConfig_by_id;
      throw notFound(id);
    });
  });
});
