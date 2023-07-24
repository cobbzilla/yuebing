// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm";
import { AccountType, AccountTypeDef } from "yuebing-model";
import * as a from "~/utils/services/serviceUtil";

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

function findAccount(id: string): Promise<AccountType> {
  return $fetch(`/api/model/account/${id}`, a.authGet()).then(a.handleJsonResponse<AccountType>);
}

function createAccount(account: AccountType): Promise<AccountType> {
  const id = AccountTypeDef.id(account);
  return $fetch(`/api/model/account/${id}`, a.authPutJson(account)).then(a.handleJsonResponse<AccountType>);
}

function updateAccount(account: AccountType): Promise<AccountType> {
  const id = AccountTypeDef.id(account);
  return $fetch(`/api/model/account/${id}`, a.authPostJson(account)).then(a.handleJsonResponse<AccountType>);
}

function deleteAccount(id: string, purge?: boolean): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/account/${id}/${purge ? `?purge=${purge}` : ""}`, a.authDelete()).then(
    a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>,
  );
}
