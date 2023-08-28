/* eslint-disable @typescript-eslint/no-unused-vars */
// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { MobilettoOrmNotFoundError, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { LibraryScanType, LibraryScanTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "libraryScan.update", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "libraryScan.update", async (event: H3Event, session, account) => {
      const libraryScanRepo = libraryScanRepository();
      if (libraryScanRepo.initialize) await libraryScanRepo.initialize();
      const id = event?.context?.params?.id;
      if (!id) throw notFound(libraryScanRepo.typeDef.idFieldName());
      const obj: LibraryScanType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (LibraryScanTypeDef.id(obj) !== id) {
        const errs: MobilettoOrmValidationErrors = {};
        errs[libraryScanRepo.typeDef.idFieldName()] = ["mismatch"];
        throw validationError(errs);
      } else {

        return await libraryScanRepo.update(obj);
      }
    });
  });
});
