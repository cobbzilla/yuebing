import { AccountType, RegistrationType, UsernameAndPasswordType } from "yuebing-model";

import * as auth from "../auth.js";
import * as a from "./serviceUtil.js";
import { AuthAccountType } from "yuebing-model/lib/esm";

export const authService = {
  login,
  logout,
  register,
  verify,
  requestPasswordReset,
  setLocale,
  updateUser,
  deleteUser,
  inviteFriends,
};

function login(auth: UsernameAndPasswordType): Promise<AuthAccountType> {
  return $fetch("/api/auth/login", a.authPostJson(auth)).then(a.handleJsonResponse<AuthAccountType>);
}

function logout() {
  // sends a Set-Cookie that invalidates whatever current cookie is set
  return $fetch("/api/auth/logout", a.authGet()).then(a.handleJsonResponse);
}

function register(registration: RegistrationType): Promise<AuthAccountType> {
  return $fetch("/api/auth/register", a.authPostJson(registration)).then(a.handleJsonResponse<AuthAccountType>);
}

function verify(email: string, token: string, resetPasswordHash: string, newPassword: string) {
  const verification: Record<string, string> = {};
  verification[auth.VERIFY_EMAIL_PARAM] = email;
  verification[auth.VERIFY_TOKEN_PARAM] = token;
  if (resetPasswordHash) {
    verification[auth.VERIFY_RESET_PARAM] = resetPasswordHash;
    verification[auth.VERIFY_PASSWORD_PARAM] = newPassword;
  }
  return $fetch("/api/auth/verify", {
    method: "POST",
    body: JSON.stringify(verification),
  }).then(a.handleJsonResponse);
}

function requestPasswordReset(email: string) {
  const body: Record<string, string> = {};
  body[auth.VERIFY_EMAIL_PARAM] = email;
  return $fetch(`/api/auth/requestPasswordReset`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then(a.handleJsonResponse<AccountType>);
}

function updateUser(user: AccountType) {
  return $fetch(`/api/auth/account`, a.authPostJson(user)).then(a.handleJsonResponse<AccountType>);
}

function setLocale(locale: string) {
  return $fetch(`/api/auth/account`, a.authPostJson({ locale })).then(a.handleJsonResponse<AccountType>);
}

function deleteUser(purge?: boolean) {
  return $fetch(`/api/auth/account${purge ? `?purge=${purge}` : ""}`, a.authDelete()).then(
    a.handleJsonResponse<AccountType>,
  );
}

function inviteFriends(emails: string[]) {
  return $fetch(`/api/auth/inviteFriends`, a.authPostJson(emails)).then(a.handleJsonResponse);
}
