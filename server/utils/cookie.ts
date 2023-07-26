import { AuthAccountType, AuthAccountTypeDef, PrivateConfigType, PublicConfigType } from "yuebing-model";
import { H3Event } from "h3";
import { SESSION_COOKIE_NAME } from "~/utils/auth";
import { MIN_ID_LENGTH } from "mobiletto-orm-typedef";

export const cookieOptions = async () => {
  const publicConfig: PublicConfigType = await PUBLIC_CONFIG.get();
  const secure = publicConfig.siteUrl.startsWith("https://");
  return { secure };
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
