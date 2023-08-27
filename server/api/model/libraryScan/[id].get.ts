/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "libraryScan.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "libraryScan.lookup", async (event: H3Event, session, account) => {
      const libraryScanRepo = libraryScanRepository();
      const id =event?.context?.params?.id;
      if (!id) throw notFound(libraryScanRepo.typeDef.idFieldName());
      const libraryScan_by_id = await libraryScanRepo.safeFindById(id);
      if (libraryScan_by_id) return libraryScan_by_id;
      throw notFound(id);
    });
  });
});