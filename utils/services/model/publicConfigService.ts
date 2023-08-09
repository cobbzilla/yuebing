// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm-typedef";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { PublicConfigType, PublicConfigTypeDef } from "yuebing-model";
import * as a from "~/utils/services/api";

export const publicConfigService = {
  findPublicConfig,
  createPublicConfig,
  updatePublicConfig,
  deletePublicConfig,
};

function findPublicConfig(
  serverErrors?: Ref<MobilettoOrmValidationErrors>,
): Promise<PublicConfigType> {
  return $fetch(`/api/model/publicConfig/public`, a.authGet())
    .then(a.handleJsonResponse<PublicConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<PublicConfigType>;
}

function createPublicConfig(
  publicConfig: PublicConfigType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<PublicConfigType> {
  return $fetch("/api/model/publicConfig/public", a.authPutJson(publicConfig))
    .then(a.handleJsonResponse<PublicConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<PublicConfigType>;
}

function updatePublicConfig(
  publicConfig: PublicConfigType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<PublicConfigType> {
  return $fetch("/api/model/publicConfig/public", a.authPatchJson(publicConfig))
    .then(a.handleJsonResponse<PublicConfigType>)
    .catch(a.handleErrors(serverErrors)) as Promise<PublicConfigType>;
}

function deletePublicConfig(
  serverErrors: Ref<MobilettoOrmValidationErrors>,
  purge?: boolean
): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/publicConfig/public/${purge ? `?purge=${purge}` : ""}`, a.authDelete())
    .then(a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>)
    .catch(a.handleErrors(serverErrors)) as Promise<PublicConfigType>;
}