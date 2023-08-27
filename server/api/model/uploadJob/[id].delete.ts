/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event, H3Error } from "h3";
import { MobilettoOrmSyncError } from "mobiletto-orm-typedef";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "uploadJob.delete", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "uploadJob.delete", async (event: H3Event, session, account) => {
      const uploadJobRepo = uploadJobRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(uploadJobRepo.typeDef.idFieldName());
      try {
        const uploadJob_by_id = await uploadJobRepo.safeFindById(id);
        if (uploadJob_by_id) {

          return await uploadJobRepo.remove(uploadJob_by_id);
        }
      } catch (e) {
        if (e instanceof H3Error) throw e;
        if (e instanceof MobilettoOrmSyncError) {
          logger.warn(`uploadJob.delete: sync error: ${e}`);
          throw conflict();
        }
        logger.error(`uploadJob.delete: unexpected error: ${e}`);
        throw serverError();
      }
      throw notFound(id);
    });
  });
});
