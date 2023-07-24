import { AuthAccountType, PublicConfigType } from "yuebing-model";
import { H3Event } from "h3";
import { SESSION_COOKIE_NAME } from "~/utils/auth";

export const cookieOptions = async () => {
  const publicConfig: PublicConfigType = await PUBLIC_CONFIG.get();
  const secure = publicConfig.siteUrl.startsWith("https://");
  return { secure };
};

export const setSessionCookie = async (event: H3Event, authAccount: AuthAccountType) => {
  setCookie(event, SESSION_COOKIE_NAME, JSON.stringify(authAccount), await cookieOptions());
  return authAccount;
};
