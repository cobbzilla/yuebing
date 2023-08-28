/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event, H3Error } from "h3";
import { MobilettoOrmSyncError } from "mobiletto-orm-typedef";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "localConfig.delete", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "localConfig.delete", async (event: H3Event, session, account) => {
      const localConfigRepo = localConfigRepository();
      if (localConfigRepo.initialize) await localConfigRepo.initialize();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(localConfigRepo.typeDef.idFieldName());
      try {
        const localConfig_by_id = await localConfigRepo.safeFindById(id);
        if (localConfig_by_id) {

          return await localConfigRepo.remove(localConfig_by_id);
        }
      } catch (e) {
        if (e instanceof H3Error) throw e;
        if (e instanceof MobilettoOrmSyncError) {
          logger.warn(`localConfig.delete: sync error: ${e}`);
          throw conflict();
        }
        logger.error(`localConfig.delete: unexpected error: ${e}`);
        throw serverError();
      }
      throw notFound(id);
    });
  });
});
