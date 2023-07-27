import { PublicConfigTypeDef, PrivateConfigTypeDef } from "yuebing-model";
import * as a from "./api.js";

export const configService = {
  browserHeaders,
  loadPublicConfig,
  loadPrivateConfig,
};

function browserHeaders(): Promise<Record<string, string>> {
  return $fetch("/api/config/headers", { method: "GET" }).then(a.handleJsonResponse<Record<string, string>>);
}
function loadPublicConfig(): Promise<PublicConfigTypeDef> {
  return $fetch("/api/config/public", { method: "GET" }).then(a.handleJsonResponse<PublicConfigTypeDef>);
}
function loadPrivateConfig(): Promise<PrivateConfigTypeDef> {
  return $fetch("/api/config/private", { method: "GET" }).then(a.handleJsonResponse<PrivateConfigTypeDef>);
}
