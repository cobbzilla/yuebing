/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event, H3Error } from "h3";
import { MobilettoOrmSyncError } from "mobiletto-orm-typedef";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "libraryScan.delete", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "libraryScan.delete", async (event: H3Event, session, account) => {
      const libraryScanRepo = libraryScanRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(libraryScanRepo.typeDef.idFieldName());
      try {
        const libraryScan_by_id = await libraryScanRepo.safeFindById(id);
        if (libraryScan_by_id) {

          return await libraryScanRepo.remove(libraryScan_by_id);
        }
      } catch (e) {
        if (e instanceof H3Error) throw e;
        if (e instanceof MobilettoOrmSyncError) {
          logger.warn(`libraryScan.delete: sync error: ${e}`);
          throw conflict();
        }
        logger.error(`libraryScan.delete: unexpected error: ${e}`);
        throw serverError();
      }
      throw notFound(id);
    });
  });
});
