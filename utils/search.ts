
export type MobilettoOrmFindApiOpts = {
  field?: string;
  value?: string;
  textSearch?: string;
  opts?: {
    first?: boolean;
    removed?: boolean;
    noRedact?: boolean;
  };
};
