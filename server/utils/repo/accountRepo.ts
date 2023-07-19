import { MobilettoOrmError, MobilettoOrmRepository } from "mobiletto-orm";
import { AccountTypeDef, AccountType } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export type AccountRepositoryType = MobilettoOrmRepository<AccountType> & {
  findByUsernameOrEmail: (usernameOrEmail: string) => Promise<AccountType | null>;
};

const REPO: { r: AccountRepositoryType | null } = {
  r: null,
};

export const accountRepository = () => {
  if (REPO.r == null) {
    REPO.r = {
      ...ybRepo<AccountType>(AccountTypeDef),
      findByUsernameOrEmail: async (usernameOrEmail: string): Promise<AccountType | null> => {
        if (!REPO.r) {
          throw new MobilettoOrmError("accountRepository not initialized");
        }
        try {
          const account: AccountType | null = await (usernameOrEmail.includes("@")
            ? REPO.r.safeFindFirstBy("email", usernameOrEmail)
            : REPO.r.safeFindFirstBy("username", usernameOrEmail));
          return account ? account : null;
        } catch (e) {
          return null;
        }
      },
    };
  }
  return REPO.r;
};
