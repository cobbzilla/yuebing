import { filterErrors } from "~/server/utils/filter/errorHandler";
import { requireAccountObject } from "~/server/utils/filter/sessionHandler";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";

export default defineEventHandler(async (event) =>
  filterErrors(event, "logout", (event) =>
    requireAccountObject(event, "logout", async (_event, session, _account) => {
      await sessionRepository().purge(session.token, { force: true });
      return true;
    }),
  ),
);
