/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { PublicConfigType, PublicConfigTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "publicConfig.update", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "publicConfig.update", async (event: H3Event, session, account) => {
      const publicConfigRepo = publicConfigRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(publicConfigRepo.typeDef.idFieldName());
      const obj: PublicConfigType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (PublicConfigTypeDef.id(obj) !== id) {
        const errs: MobilettoOrmValidationErrors = {};
        errs[publicConfigRepo.typeDef.idFieldName()] = ["mismatch"];
        throw validationError(errs);
      } else {

        return await publicConfigRepo.update(obj);
      }
    });
  });
});
