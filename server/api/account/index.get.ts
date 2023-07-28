import { filterErrors } from "~/server/utils/filter/errorFilter";
import { requireAccountObject } from "~/server/utils/filter/sessionFilter";
import { AccountTypeDef, AuthAccountType } from "yuebing-model";

export default defineEventHandler(async (event) =>
  filterErrors(event, "account.get", (event) =>
    requireAccountObject(event, "account.get", (event, session, account): Promise<AuthAccountType> => {
      return Promise.resolve({
        ...AccountTypeDef.redact(account),
        session: session.token,
      } as AuthAccountType);
    }),
  ),
);
