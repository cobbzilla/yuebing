import { CookieSerializeOptions } from "cookie-es";
import { AuthAccountType, RegistrationTypeDef } from "yuebing-model";
import { hideOrmFields } from "~/utils/orm";

export const VERIFY_EMAIL_PARAM = "e";
export const VERIFY_TOKEN_PARAM = "t";
export const VERIFY_RESET_PARAM = "r";
export const VERIFY_PASSWORD_PARAM = "p";
// export const VERIFY_ENDPOINT = "/verify";
// export const LOGIN_ENDPOINT = "/signIn";
// export const REGISTER_ENDPOINT = "/signUp";
// const NO_CACHE_HEADER = 'x-yb-nocache'

export const SESSION_COOKIE_NAME = "yb-session";
export const SESSION_HEADER = "x-yb-session";
export const SESSION_QUERY_PARAM = "s";
export const ANON_LOCALE_STORAGE_KEY = "anon_locale";
export type UserStatus = {
  loggedIn?: boolean;
};

export function sessionParams(user?: AuthAccountType, status?: UserStatus) {
  if (!user || !user.session || !status || !status.loggedIn) {
    return "";
  }
  return `?${SESSION_QUERY_PARAM}=${user.session}`;
}

export const RegistrationFormTypeDef = hideOrmFields(RegistrationTypeDef, ["flags"]);

const COOKIE_SAME_SITE = "strict";
const COOKIE_PATH = "/";
export const cookieOpts = (secure: boolean): CookieSerializeOptions => {
  const sameSite = COOKIE_SAME_SITE;
  const path = COOKIE_PATH;
  return { secure, sameSite, path };
};

export const sessionCookie = (secure: boolean) => useCookie(SESSION_COOKIE_NAME, cookieOpts(secure));
