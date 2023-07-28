import { H3Event } from "h3";
import { SESSION_COOKIE_NAME } from "~/utils/auth";
import { filterErrors } from "~/server/utils/filter/errorFilter";
import { requireAccountObject } from "~/server/utils/filter/sessionFilter";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";
import { cookieOptions } from "~/server/utils/cookie";

export default defineEventHandler(async (event: H3Event) =>
  filterErrors(event, "logout", (event: H3Event) =>
    requireAccountObject(event, "logout", async (event: H3Event, session, _account) => {
      await sessionRepository().purge(session.token, { force: true });
      deleteCookie(event, SESSION_COOKIE_NAME, await cookieOptions());
      return true;
    }),
  ),
);
