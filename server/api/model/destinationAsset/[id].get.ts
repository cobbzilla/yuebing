/* eslint-disable camelcase,@typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "destinationAsset.lookup", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "destinationAsset.lookup", async (event: H3Event, session, account) => {
      const destinationAssetRepo = destinationAssetRepository();
      const id =event?.context?.params?.id;
      if (!id) throw notFound(destinationAssetRepo.typeDef.idFieldName());
      const destinationAsset_by_id = await destinationAssetRepo.safeFindById(id);
      if (destinationAsset_by_id) return destinationAsset_by_id;
      throw notFound(id);
    });
  });
});
