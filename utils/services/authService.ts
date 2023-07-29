import { AccountType, AuthAccountType, RegistrationType, UsernameAndPasswordType } from "yuebing-model";

import { Ref } from "vue";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import * as auth from "../auth.js";
import * as a from "./api.js";

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

function login(
  auth: UsernameAndPasswordType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<AuthAccountType> {
  return $fetch("/api/auth/login", a.authPostJson(auth))
    .then(a.handleJsonResponse<AuthAccountType>)
    .catch((e) => {
      console.log(`authService.login error: ${e}`);
      a.handleErrors(serverErrors)(e);
    }) as Promise<AuthAccountType>;
}

function logout(): Promise<boolean> {
  // deletes the current session cookie
  return $fetch("/api/auth/logout", a.authGet()).then(a.handleJsonResponse<boolean>);
}

function register(
  registration: RegistrationType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<AuthAccountType> {
  return $fetch("/api/auth/register", a.authPostJson(registration))
    .then(a.handleJsonResponse<AuthAccountType>)
    .catch(a.handleErrors(serverErrors));
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
