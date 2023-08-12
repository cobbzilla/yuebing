/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event, H3Error } from "h3";
import { MobilettoOrmSyncError } from "mobiletto-orm-typedef";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "downloadedAsset.delete", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "downloadedAsset.delete", async (event: H3Event, session, account) => {
      const downloadedAssetRepo = downloadedAssetRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(downloadedAssetRepo.typeDef.idFieldName());
      try {
        const downloadedAsset_by_id = await downloadedAssetRepo.safeFindById(id);
        if (downloadedAsset_by_id) {

          return await downloadedAssetRepo.remove(downloadedAsset_by_id);
        }
      } catch (e) {
        if (e instanceof H3Error) throw e;
        if (e instanceof MobilettoOrmSyncError) {
          logger.warn(`downloadedAsset.delete: sync error: ${e}`);
          throw conflict();
        }
        logger.error(`downloadedAsset.delete: unexpected error: ${e}`);
        throw serverError();
      }
      throw notFound(id);
    });
  });
});