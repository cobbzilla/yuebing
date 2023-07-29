// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { DestinationType, DestinationTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "destination.create", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "destination.create", async (event: H3Event, session, account) => {
      const id = event?.context?.params?.id;
      if (!id) throw notFound("");
      const obj: DestinationType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (DestinationTypeDef.id(obj) !== id) {
        throw validationError({ id: ["mismatch"] });
      } else {
        return await destinationRepo.create(obj);
      }
    });
  });
});
