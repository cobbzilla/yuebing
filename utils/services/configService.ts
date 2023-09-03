import { PublicConfigType, PrivateConfigType } from "yuebing-model";
import * as a from "../model/serviceHelper.js";

export const configService = {
  browserHeaders,
  loadPublicConfig,
  loadPrivateConfig,
};

function browserHeaders(): Promise<Record<string, string>> {
  return $fetch("/api/config/headers", { method: "GET" }).then(a.handleJsonResponse<Record<string, string>>);
}
function loadPublicConfig(): Promise<PublicConfigType> {
  return $fetch("/api/config/public", { method: "GET" }).then(a.handleJsonResponse<PublicConfigType>);
}
function loadPrivateConfig(): Promise<PrivateConfigType> {
  return $fetch("/api/config/private", { method: "GET" }).then(a.handleJsonResponse<PrivateConfigType>);
}
