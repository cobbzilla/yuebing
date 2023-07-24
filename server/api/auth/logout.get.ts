import { filterErrors } from "~/server/utils/filter/errorHandler";
import { requireAccountObject } from "~/server/utils/filter/sessionHandler";
import { sessionRepository, SessionRepositoryType } from "~/server/utils/repo/sessionRepo";
import { SessionTypeDef } from "yuebing-model";

export default defineEventHandler(async (event) =>
  filterErrors(event, "logout", async (event) =>
    requireAccountObject(event, "logout", async (event, session, account) => {
      await sessionRepository().purge(session.token, { force: true });
      return true;
    }),
  ),
);
