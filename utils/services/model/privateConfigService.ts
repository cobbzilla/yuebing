// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm-typedef";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { PrivateConfigType, PrivateConfigTypeDef } from "yuebing-model";
import * as a from "~/utils/model/serviceHelper.js";

export const privateConfigService = {
  findPrivateConfig,
  createPrivateConfig,
  updatePrivateConfig,
  deletePrivateConfig,
};

function findPrivateConfig(
  serverErrors?: Ref<MobilettoOrmValidationErrors>,
): Promise<PrivateConfigType> {
  return $fetch(`/api/model/privateConfig/private`, a.authGet())
    .then(a.handleJsonResponse<PrivateConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<PrivateConfigType>;
}

function createPrivateConfig(
  privateConfig: PrivateConfigType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<PrivateConfigType> {
  return $fetch("/api/model/privateConfig/private", a.authPutJson(privateConfig))
    .then(a.handleJsonResponse<PrivateConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<PrivateConfigType>;
}

function updatePrivateConfig(
  privateConfig: PrivateConfigType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<PrivateConfigType> {
  return $fetch("/api/model/privateConfig/private", a.authPatchJson(privateConfig))
    .then(a.handleJsonResponse<PrivateConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<PrivateConfigType>;
}

function deletePrivateConfig(
  serverErrors: Ref<MobilettoOrmValidationErrors>,
  purge?: boolean
): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/privateConfig/private/${purge ? `?purge=${purge}` : ""}`, a.authDelete())
    .then(a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>)
    .catch(a.handleErrors(serverErrors)) as Promise<PrivateConfigType>;
}
