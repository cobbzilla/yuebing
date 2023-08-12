/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmNotFoundError, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { DiscoveredAssetType, DiscoveredAssetTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "discoveredAsset.update", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "discoveredAsset.update", async (event: H3Event, session, account) => {
      const discoveredAssetRepo = discoveredAssetRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(discoveredAssetRepo.typeDef.idFieldName());
      const obj: DiscoveredAssetType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (DiscoveredAssetTypeDef.id(obj) !== id) {
        const errs: MobilettoOrmValidationErrors = {};
        errs[discoveredAssetRepo.typeDef.idFieldName()] = ["mismatch"];
        throw validationError(errs);
      } else {

        return await discoveredAssetRepo.update(obj);
      }
    });
  });
});