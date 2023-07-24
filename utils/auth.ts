import { AuthAccountType } from "yuebing-model";

export const VERIFY_EMAIL_PARAM = "e";
export const VERIFY_TOKEN_PARAM = "t";
export const VERIFY_RESET_PARAM = "r";
export const VERIFY_PASSWORD_PARAM = "p";
// export const VERIFY_ENDPOINT = "/verify";
// export const LOGIN_ENDPOINT = "/signIn";
// export const REGISTER_ENDPOINT = "/signUp";
// const NO_CACHE_HEADER = 'x-yb-nocache'

export const SESSION_COOKIE_NAME = "yb-account";
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
