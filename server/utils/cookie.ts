import { CookieSerializeOptions } from "cookie-es";
import { H3Event } from "h3";
import { MIN_ID_LENGTH } from "mobiletto-orm-typedef";
import { AuthAccountType, PublicConfigType } from "yuebing-model";
import { cookieOpts, SESSION_COOKIE_NAME } from "~/utils/auth";

export const cookieOptions = async (): Promise<CookieSerializeOptions> => {
  const publicConfig: PublicConfigType = await PUBLIC_CONFIG.get();
  const secure = publicConfig.siteUrl.startsWith("https://");
  return cookieOpts(secure);
};

export const setSessionCookie = async (event: H3Event, authAccount: AuthAccountType) => {
  if (!authAccount.session || typeof authAccount.session !== "string" || authAccount.session.length < MIN_ID_LENGTH) {
    throw new Error(
      `setSessionCookie: authAccount.session was unset or invalid: ${authAccount?.session || "null or undefined"}`,
    );
  }
  setCookie(event, SESSION_COOKIE_NAME, authAccount.session, await cookieOptions());
  return authAccount;
};
