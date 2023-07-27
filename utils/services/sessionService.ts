import { AuthAccountType } from "yuebing-model";
import * as a from "~/utils/services/api";

export const sessionService = {
  getAccount,
};

function getAccount(): Promise<AuthAccountType> {
  return $fetch("/api/account", a.authGet()).then(a.handleJsonResponse<AuthAccountType>);
}
