import { MobilettoOrmError, MobilettoOrmRepository } from "mobiletto-orm";
import { AccountType, AccountTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export type AccountRepositoryType = MobilettoOrmRepository<AccountType> & {
  findByUsernameOrEmail: (usernameOrEmail: string) => Promise<AccountType | null>;
};

export const accountRepository = (): AccountRepositoryType => {
  const baseRepo = ybRepo<AccountType>(AccountTypeDef);
  return {
    ...baseRepo,
    findByUsernameOrEmail: async (usernameOrEmail: string): Promise<AccountType | null> => {
      try {
        return await (usernameOrEmail.includes("@")
          ? baseRepo.safeFindFirstBy("email", usernameOrEmail)
          : baseRepo.safeFindFirstBy("username", usernameOrEmail));
      } catch (e) {
        throw new MobilettoOrmError(`findByUsernameOrEmail: ${e}`);
      }
    },
  };
};
