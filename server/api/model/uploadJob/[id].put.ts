/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { UploadJobType, UploadJobTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "uploadJob.create", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "uploadJob.create", async (event: H3Event, session, account) => {
      const uploadJobRepo = uploadJobRepository();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(uploadJobRepo.typeDef.idFieldName());
      const obj: UploadJobType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (UploadJobTypeDef.id(obj) !== id) {
        const errs: MobilettoOrmValidationErrors = {};
        errs[uploadJobRepo.typeDef.idFieldName()] = ["mismatch"];
        throw validationError(errs);
      } else {
        return await uploadJobRepo.create(obj);
      }
    });
  });
});