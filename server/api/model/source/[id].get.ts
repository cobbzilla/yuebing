/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "source.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "source.lookup", async (event: H3Event, session, account) => {
      const sourceRepo = sourceRepository();
      if (sourceRepo.initialize) await sourceRepo.initialize();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(sourceRepo.typeDef.idFieldName());
      const source_by_id = await sourceRepo.safeFindById(id);
      if (source_by_id) return source_by_id;
      throw notFound(id);
    });
  });
});
