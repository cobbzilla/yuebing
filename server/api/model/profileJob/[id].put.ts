/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { ProfileJobType, ProfileJobTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "profileJob.create", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "profileJob.create", async (event: H3Event, session, account) => {
      const profileJobRepo = profileJobRepository();
      if (profileJobRepo.initialize) await profileJobRepo.initialize();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(profileJobRepo.typeDef.idFieldName());
      const obj: ProfileJobType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (ProfileJobTypeDef.id(obj) !== id) {
        const errs: MobilettoOrmValidationErrors = {};
        errs[profileJobRepo.typeDef.idFieldName()] = ["mismatch"];
        throw validationError(errs);
      } else {
        return await profileJobRepo.create(obj);
      }
    });
  });
});
