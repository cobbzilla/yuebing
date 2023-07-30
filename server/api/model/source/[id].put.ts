// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { SourceType, SourceTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "source.create", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "source.create", async (event: H3Event, session, account) => {
      const id = event?.context?.params?.id;
      if (!id) throw notFound("id");
      const obj: SourceType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (SourceTypeDef.id(obj) !== id) {
        throw validationError({ id: ["mismatch"] });
      } else {
        const sourceRepo = sourceRepository();
        return await sourceRepo.create(obj);
      }
    });
  });
});
