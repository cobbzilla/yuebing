// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { H3Event } from "h3";
import { AccountType, AccountTypeDef } from "yuebing-model";

export default defineEventHandler(async (event: H3Event) => {
  return await filterErrors(event, "account.update", async (event: H3Event) => {
    return await requireAdminAccountObject(event, "account.update", async (event: H3Event, session, account) => {
      const id = event?.context?.params?.id;
      if (!id) throw notFound("id");
      const obj: AccountType = await readBody(event);
      if (!obj) {
        throw badRequest();
      }
      if (AccountTypeDef.id(obj) !== id) {
        throw validationError({ id: ["mismatch"] });
      } else {
        return await accountRepo.update(obj);
      }
    });
  });
});
