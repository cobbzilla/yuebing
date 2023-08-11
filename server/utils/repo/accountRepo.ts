import * as bcrypt from "bcrypt";
import {
  MobilettoOrmError,
  MobilettoOrmFindOpts,
  MobilettoOrmRepository
} from "mobiletto-orm";
import { AccountType, AccountTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";
import { bcryptRounds } from "~/server/utils/config";

export type AccountRepositoryType = MobilettoOrmRepository<AccountType> & {
  findByUsernameOrEmail: (usernameOrEmail: string, opts?: MobilettoOrmFindOpts) => Promise<AccountType | null>;
};

const ServerAccountTypeDef = AccountTypeDef.extend({
  fields: {
    password: {
      normalize: async (v: unknown): Promise<string> => await bcrypt.hash(`${v}`, await bcryptRounds()),
    },
  },
});

export const accountRepository = (): AccountRepositoryType => {
  const baseRepo = ybRepo<AccountType>(ServerAccountTypeDef);
  return {
    ...baseRepo,
    findByUsernameOrEmail: async (
      usernameOrEmail: string,
      opts?: MobilettoOrmFindOpts,
    ): Promise<AccountType | null> => {
      try {
        return await (usernameOrEmail.includes("@")
          ? baseRepo.safeFindFirstBy("email", usernameOrEmail, opts)
          : baseRepo.safeFindFirstBy("username", usernameOrEmail, opts));
      } catch (e) {
        throw new MobilettoOrmError(`findByUsernameOrEmail: ${e}`);
      }
    },
  };
};
