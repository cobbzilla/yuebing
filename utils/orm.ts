import { MobilettoOrmFieldDefConfig, MobilettoOrmTypeDef, MobilettoOrmObject, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { fieldErrorMessage } from "yuebing-messages";
import {Ref} from "vue/dist/vue";
import {accountService} from "~/utils/services/model/accountService";
import {MobilettoOrmFindApiOpts} from "~/utils/search";

export const hideOrmFields = (typeDef: MobilettoOrmTypeDef, fields: string[]): MobilettoOrmTypeDef => {
  const hidden: Record<string, MobilettoOrmFieldDefConfig> = {};
  fields.forEach((f) => {
    hidden[f] = { control: "hidden" };
  });
  return typeDef.extend({ typeName: typeDef.typeName, fields: hidden });
};

export const normalizeMsg = (errMsg: string) => errMsg.replace(/\./g, "_");

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
      const labelPfx = labelPrefixes.includes("") ? labelPrefixes : [...labelPrefixes, ""];
      const fld = normalizeMsg(fieldName);
      return fieldErrorMessage(fld, errMsg, messages, labelPfx);
    }
  }
  return "";
};

export const updateOrmList = <T extends MobilettoOrmObject>(
  typeDef: MobilettoOrmTypeDef,
  list: ((T[]) | null),
  id: string,
  opts?: { object?: T; remove?: boolean }
) => {
  if (!opts) return;
  if (list) {
    const foundIndex = list.findIndex((e) => typeDef.id(e) === id);
    if (foundIndex && foundIndex >= 0) {
      if (opts && opts.remove === true) {
        list.splice(foundIndex, 1);
      } else if (opts && opts.object) {
        list.splice(foundIndex, 1, opts.object);
      }
    }
  }
};

export interface MobilettoOrmStore<T extends MobilettoOrmObject> {
  found: T | null,
  created: T | null,
  updated: T | null,
  deleted: boolean | null,
  objectList: T[] | null,

  lookup: (id: string, serverErrors: Ref<MobilettoOrmValidationErrors>) => Promise<T>;
  search: (query?: MobilettoOrmFindApiOpts) => Promise<T[]>;
  create: (object: T, serverErrors: Ref<MobilettoOrmValidationErrors>) => Promise<T>;
  update: (object: T, serverErrors: Ref<MobilettoOrmValidationErrors>) => Promise<T>;
  delete: (id: string, serverErrors: Ref<MobilettoOrmValidationErrors>, purge?: boolean) => Promise<boolean>;
}
