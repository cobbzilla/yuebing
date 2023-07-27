import { filterErrors } from "~/server/utils/filter/errorFilter";
import { requireAccountObject } from "~/server/utils/filter/sessionFilter";
import { AccountTypeDef } from "yuebing-model";

export default defineEventHandler(async (event) =>
  filterErrors(event, "account.get", (event) =>
    requireAccountObject(event, "logout", (event, session, account) => ({
      ...AccountTypeDef.redact(account),
      session: session.token,
    })),
  ),
);
