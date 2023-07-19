import { AccountType, RegistrationType, UsernameAndPasswordType } from "yuebing-model";

import * as auth from "../auth.js";
import * as a from "./serviceUtil.js";
import { AuthAccountType } from "yuebing-model/lib/esm";

export const accountService = {
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
  return fetch("/api/account/authenticate", a.authPostJson(auth)).then(a.handleJsonResponse<AuthAccountType>);
}

function logout() {
  // sends a Set-Cookie that invalidates whatever current cookie is set
  return fetch("/api/account/logout", a.authGet()).then(a.handleJsonResponse);
}

function register(registration: RegistrationType): Promise<AuthAccountType> {
  return fetch("/api/account/register", a.authPostJson(registration)).then(a.handleJsonResponse<AuthAccountType>);
}

function verify(email: string, token: string, resetPasswordHash: string, newPassword: string) {
  const verification: Record<string, string> = {};
  verification[auth.VERIFY_EMAIL_PARAM] = email;
  verification[auth.VERIFY_TOKEN_PARAM] = token;
  if (resetPasswordHash) {
    verification[auth.VERIFY_RESET_PARAM] = resetPasswordHash;
    verification[auth.VERIFY_PASSWORD_PARAM] = newPassword;
  }
  return fetch("/api/account/verify", {
    method: "POST",
    body: JSON.stringify(verification),
  }).then(a.handleJsonResponse);
}

function requestPasswordReset(email: string) {
  const body: Record<string, string> = {};
  body[auth.VERIFY_EMAIL_PARAM] = email;
  return fetch("/api/account/requestPasswordReset", {
    method: "POST",
    body: JSON.stringify(body),
  }).then(a.handleJsonResponse);
}

function updateUser(update: AccountType) {
  return fetch("/api/account/update", a.authPostJson(update)).then(a.handleJsonResponse);
}

function setLocale(user: AccountType, locale: string) {
  return fetch("/api/account/update", a.authPostJson(Object.assign({}, user, { locale }))).then(a.handleJsonResponse);
}

function deleteUser() {
  return fetch("/api/account/delete", a.authPostJson({})).then(a.handleJsonResponse);
}

function inviteFriends(emails: string[]) {
  return fetch("/api/account/inviteFriends", a.authPostJson(emails)).then(a.handleJsonResponse);
}
