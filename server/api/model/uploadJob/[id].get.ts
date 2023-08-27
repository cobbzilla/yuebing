/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "uploadJob.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "uploadJob.lookup", async (event: H3Event, session, account) => {
      const uploadJobRepo = uploadJobRepository();
      const id =event?.context?.params?.id;
      if (!id) throw notFound(uploadJobRepo.typeDef.idFieldName());
      const uploadJob_by_id = await uploadJobRepo.safeFindById(id);
      if (uploadJob_by_id) return uploadJob_by_id;
      throw notFound(id);
    });
  });
});
