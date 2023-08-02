import { AuthAccountType } from "yuebing-model";
import * as a from "~/utils/services/api";

export const sessionService = {
  getAccount,
};

function getAccount(): Promise<AuthAccountType> {
  return $fetch("/api/account", a.authGet())
    .then(a.handleJsonResponse<AuthAccountType>)
    .catch((_e) => {
      // console.log(`getAccount error: ${e}, returning empty object`);
      return {};
    });
}
