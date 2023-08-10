// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm-typedef";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { DestinationType, DestinationTypeDef } from "yuebing-model";
import * as a from "~/utils/model/serviceHelper.js";

export const destinationService = {
  searchDestination,
  findDestination,
  createDestination,
  updateDestination,
  deleteDestination,
};

function searchDestination(query?: MobilettoOrmFindApiOpts): Promise<DestinationType[]> {
  return $fetch("/api/model/destination", a.authPostJson(query)).then(a.handleJsonResponse<DestinationType[]>);
}

function findDestination(
  id: string,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<DestinationType> {
  return $fetch(`/api/model/destination/${id}`, a.authGet())
    .then(a.handleJsonResponse<DestinationType>)
    .catch(a.handleErrors(serverErrors)) as Promise<DestinationType>;
}

function createDestination(
  destination: DestinationType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<DestinationType> {
  const id = DestinationTypeDef.id(destination);
  return $fetch(`/api/model/destination/${id}`, a.authPutJson(destination))
    .then(a.handleJsonResponse<DestinationType>)
    .catch(a.handleErrors(serverErrors)) as Promise<DestinationType>;
}

function updateDestination(
  destination: DestinationType,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
): Promise<DestinationType> {
  const id = DestinationTypeDef.id(destination);
  return $fetch(`/api/model/destination/${id}`, a.authPatchJson(destination))
    .then(a.handleJsonResponse<DestinationType>)
    .catch(a.handleErrors(serverErrors)) as Promise<DestinationType>;
}

function deleteDestination(
  id: string,
  serverErrors: Ref<MobilettoOrmValidationErrors>,
  purge?: boolean
): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/destination/${id}/${purge ? `?purge=${purge}` : ""}`, a.authDelete())
    .then(a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>)
    .catch(a.handleErrors(serverErrors)) as Promise<DestinationType>;
}
