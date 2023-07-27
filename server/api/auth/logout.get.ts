import { filterErrors } from "~/server/utils/filter/errorFilter";
import { requireAccountObject } from "~/server/utils/filter/sessionFilter";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";

export default defineEventHandler(async (event) =>
  filterErrors(event, "logout", (event) =>
    requireAccountObject(event, "logout", async (_event, session, _account) => {
      await sessionRepository().purge(session.token, { force: true });
      deleteCookie(event, SESSION_COOKIE_NAME, await cookieOptions());
      return true;
    }),
  ),
);
