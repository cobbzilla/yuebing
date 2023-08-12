/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { DiscoveredAssetTypeDef } from "yuebing-model";
import { MobilettoOrmFindApiOpts } from "/storeHelper.ts";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "discoveredAsset.search", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "discoveredAsset.search", async (event: H3Event, session, account) => {
      const opts: MobilettoOrmFindApiOpts = (await readBody(event)) || {};
      if (typeof DiscoveredAssetTypeDef.apiConfig.search?.validate === "function") {
        const validated = await DiscoveredAssetTypeDef.apiConfig.search.validate(account, null, opts);
        if (validated === true || (typeof validated === "object" && Object.keys(validated).length === 0)) {
          // successfully validated
        } else if (typeof validated === "object" && Object.keys(validated).length > 0) {
          throw validationError(validated);
        } else {
          throw validationError({global: ["validation"]});
        }
      }
      const discoveredAssetRepo = discoveredAssetRepository();
      if (opts.field && opts.value) {
        return await discoveredAssetRepo.safeFindBy(opts.field, opts.value, opts.opts || {});
      } else if (opts.textSearch && DiscoveredAssetTypeDef.textSearchFields.length > 0) {
        return await discoveredAssetRepo.find({ predicate: (obj) => DiscoveredAssetTypeDef.textMatch(obj, opts.textSearch || "") });
      } else {
        return await discoveredAssetRepo.find(opts.opts || {});
      }
    });
  });
});
