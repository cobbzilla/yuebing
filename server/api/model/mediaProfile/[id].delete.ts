/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event, H3Error } from "h3";
import { MobilettoOrmSyncError } from "mobiletto-orm-typedef";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "mediaProfile.delete", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "mediaProfile.delete", async (event: H3Event, session, account) => {
      const mediaProfileRepo = mediaProfileRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(mediaProfileRepo.typeDef.idFieldName());
      try {
        const mediaProfile_by_id = await mediaProfileRepo.safeFindById(id);
        if (mediaProfile_by_id) {

          return await mediaProfileRepo.remove(mediaProfile_by_id);
        }
      } catch (e) {
        if (e instanceof H3Error) throw e;
        if (e instanceof MobilettoOrmSyncError) {
          logger.warn(`mediaProfile.delete: sync error: ${e}`);
          throw conflict();
        }
        logger.error(`mediaProfile.delete: unexpected error: ${e}`);
        throw serverError();
      }
      throw notFound(id);
    });
  });
});
