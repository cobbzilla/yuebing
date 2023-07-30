import { MobilettoOrmFieldDefConfig, MobilettoOrmTypeDef, MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { ValidationError } from "yup";
import { fieldErrorMessage } from "yuebing-messages";

export const hideOrmFields = (typeDef: MobilettoOrmTypeDef, fields: string[]): MobilettoOrmTypeDef => {
  const hidden: Record<string, MobilettoOrmFieldDefConfig> = {};
  fields.forEach((f) => {
    hidden[f] = { control: "hidden" };
  });
  return typeDef.extend({ typeName: typeDef.typeName, fields: hidden });
};

export const ormFieldErrorMessage = (
  field: string | string[],
  messages: Record<string, string>,
  labelPrefixes: string[],
  validationError: ValidationError,
  serverErrors: MobilettoOrmValidationErrors,
  submitted?: boolean,
  objPath?: string,
): string => {
  if (submitted === false) {
    return "";
  }
  const errs = validationError && validationError.errors ? validationError.errors : [];
  const fields = Array.isArray(field) ? field : [field];
  const fieldName = fields[0];
  for (const f of fields) {
    let errMsg = errs.find((e) => e.includes(`${f}_`));
    if (!errMsg && objPath && objPath.length > 0) {
      errMsg = errs.find((e) => e.includes(`${objPath}_`));
    }
    if (errMsg) {
      return fieldErrorMessage(fieldName, errMsg, messages, labelPrefixes);
    } else if (serverErrors && serverErrors[fieldName]) {
      return fieldErrorMessage(fieldName, serverErrors[fieldName][0], messages, labelPrefixes);
    }
  }
  return "";
};
