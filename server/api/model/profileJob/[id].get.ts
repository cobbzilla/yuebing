/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "profileJob.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "profileJob.lookup", async (event: H3Event, session, account) => {
      const profileJobRepo = profileJobRepository();
      const id =event?.context?.params?.id;
      if (!id) throw notFound(profileJobRepo.typeDef.idFieldName());
      const profileJob_by_id = await profileJobRepo.safeFindById(id);
      if (profileJob_by_id) return profileJob_by_id;
      throw notFound(id);
    });
  });
});