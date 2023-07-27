// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { MobilettoOrmObject, MobilettoOrmPurgeResults } from "mobiletto-orm";
import { DestinationType, DestinationTypeDef } from "yuebing-model";
import * as a from "~/utils/services/api";

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

function findDestination(id: string): Promise<DestinationType> {
  return $fetch(`/api/model/destination/${id}`, a.authGet()).then(a.handleJsonResponse<DestinationType>);
}

function createDestination(destination: DestinationType): Promise<DestinationType> {
  const id = DestinationTypeDef.id(destination);
  return $fetch(`/api/model/destination/${id}`, a.authPutJson(destination)).then(a.handleJsonResponse<DestinationType>);
}

function updateDestination(destination: DestinationType): Promise<DestinationType> {
  const id = DestinationTypeDef.id(destination);
  return $fetch(`/api/model/destination/${id}`, a.authPostJson(destination)).then(a.handleJsonResponse<DestinationType>);
}

function deleteDestination(id: string, purge?: boolean): Promise<MobilettoOrmObject | MobilettoOrmPurgeResults> {
  return $fetch(`/api/model/destination/${id}/${purge ? `?purge=${purge}` : ""}`, a.authDelete()).then(
    a.handleJsonResponse<MobilettoOrmObject | MobilettoOrmPurgeResults>,
  );
}
