import { MobilettoOrmFieldDefConfig, MobilettoOrmTypeDef, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { fieldErrorMessage } from "yuebing-messages";

export const hideOrmFields = (typeDef: MobilettoOrmTypeDef, fields: string[]): MobilettoOrmTypeDef => {
  const hidden: Record<string, MobilettoOrmFieldDefConfig> = {};
  fields.forEach((f) => {
    hidden[f] = { control: "hidden" };
  });
  return typeDef.extend({ typeName: typeDef.typeName, fields: hidden });
};

const normalizeMsg = (errMsg: string) => errMsg.replace(/\./g, "_");

const errMatch = (f: string) => (e: string) => normalizeMsg(e) === normalizeMsg(f);

const errMatchStart = (objPath: string) => (e: string) => normalizeMsg(e).startsWith(`${normalizeMsg(objPath)}_`);

export const ormFieldErrorMessage = (
  field: string | string[],
  messages: Record<string, string>,
  labelPrefixes: string[],
  clientErrors: MobilettoOrmValidationErrors,
  serverErrors: MobilettoOrmValidationErrors,
  submitted?: boolean,
  objPath?: string,
): string => {
  if (submitted === false) {
    return "";
  }
  const fields = Array.isArray(field) ? field : [field];
  const fieldName = fields[0];
  for (const f of fields) {
    const clientErrFields = Object.keys(clientErrors);
    const serverErrFields = Object.keys(serverErrors);
    let errMsg = clientErrFields.find(errMatch(f));
    if (errMsg) {
      errMsg = errMsg + "_" + clientErrors[errMsg][0];
    } else {
      errMsg = serverErrFields.find(errMatch(f)) || undefined;
      if (errMsg) {
        errMsg = errMsg + "_" + serverErrors[errMsg][0];
      }
    }
    if (!errMsg && objPath && objPath.length > 0) {
      errMsg = clientErrFields.find(errMatchStart(objPath));
      if (errMsg) {
        errMsg = errMsg + "_" + clientErrors[errMsg][0];
      } else {
        errMsg = serverErrFields.find(errMatchStart(objPath));
        if (errMsg) {
          errMsg = errMsg + "_" + serverErrors[errMsg][0];
        }
      }
    }
    if (errMsg) {
      errMsg = normalizeMsg(errMsg);
      return fieldErrorMessage(normalizeMsg(fieldName), errMsg, messages, labelPrefixes);
    }
  }
  return "";
};
