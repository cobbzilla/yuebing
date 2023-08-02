// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm-typedef";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { AccountType, AccountTypeDef } from "yuebing-model";
import * as a from "~/utils/services/api";

export const accountService = {
  searchAccount,
  findAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};

function searchAccount(query?: MobilettoOrmFindApiOpts): Promise<AccountType[]> {
  return $fetch("/api/model/account", a.authPostJson(query)).then(a.handleJsonResponse<AccountType[]>);
}

function findAccount(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AccountType> {
  return $fetch(`/api/model/account/${id}`, a.authGet())
    .then(a.handleJsonResponse<AccountType>)
    .catch(a.handleErrors(serverErrors)) as Promise<AccountType>;
}

function createAccount(account: AccountType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AccountType> {
  const id = AccountTypeDef.id(account);
  return $fetch(`/api/model/account/${id}`, a.authPutJson(account))
    .then(a.handleJsonResponse<AccountType>)
    .catch(a.handleErrors(serverErrors)) as Promise<AccountType>;
}

function updateAccount(account: AccountType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AccountType> {
  const id = AccountTypeDef.id(account);
  return $fetch(`/api/model/account/${id}`, a.authPatchJson(account))
    .then(a.handleJsonResponse<AccountType>)
    .catch(a.handleErrors(serverErrors)) as Promise<AccountType>;
}

function deleteAccount(
  id: string,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
  purge?: boolean,
): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/account/${id}/${purge ? `?purge=${purge}` : ""}`, a.authDelete())
    .then(a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>)
    .catch(a.handleErrors(serverErrors)) as Promise<AccountType>;
}
