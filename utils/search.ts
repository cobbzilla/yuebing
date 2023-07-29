import { FIND_FIRST } from "mobiletto-orm-typedef";

export type MobilettoOrmFindApiOpts = {
  field?: string;
  value?: string;
  opts?: {
    first?: boolean;
    removed?: boolean;
    noRedact?: boolean;
  };
};
