// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm-typedef";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { LocalConfigType, LocalConfigTypeDef } from "yuebing-model";
import * as a from "~/utils/model/serviceHelper.js";

export const localConfigService = {
  findLocalConfig,
  createLocalConfig,
  updateLocalConfig,
  deleteLocalConfig,
};

function findLocalConfig(
  serverErrors?: Ref<MobilettoOrmValidationErrors>,
): Promise<LocalConfigType> {
  return $fetch(`/api/model/localConfig/local`, a.authGet())
    .then(a.handleJsonResponse<LocalConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<LocalConfigType>;
}

function createLocalConfig(
  localConfig: LocalConfigType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<LocalConfigType> {
  return $fetch("/api/model/localConfig/local", a.authPutJson(localConfig))
    .then(a.handleJsonResponse<LocalConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<LocalConfigType>;
}

function updateLocalConfig(
  localConfig: LocalConfigType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<LocalConfigType> {
  return $fetch("/api/model/localConfig/local", a.authPatchJson(localConfig))
    .then(a.handleJsonResponse<LocalConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<LocalConfigType>;
}

function deleteLocalConfig(
  serverErrors: Ref<MobilettoOrmValidationErrors>,
  purge?: boolean
): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/localConfig/local/${purge ? `?purge=${purge}` : ""}`, a.authDelete())
    .then(a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>)
    .catch(a.handleErrors(serverErrors)) as Promise<LocalConfigType>;
}