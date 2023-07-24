import { MobilettoOrmTypeDef } from "mobiletto-orm";
import { MobilettoOrmFieldDefConfig } from "mobiletto-orm-typedef";

export const hideOrmFields = (typeDef: MobilettoOrmTypeDef, fields: string[]): MobilettoOrmTypeDef => {
  const hidden = {};
  fields.forEach((f) => {
    const field: MobilettoOrmFieldDefConfig = typeDef.fields[f];
    const fieldCopy: MobilettoOrmFieldDefConfig = JSON.parse(JSON.stringify(field)) as MobilettoOrmFieldDefConfig;
    fieldCopy.control = "hidden";
    hidden[f] = fieldCopy;
  });
  return typeDef.extend({ fields: hidden });
};
