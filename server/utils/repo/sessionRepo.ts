import { generateId, MobilettoOrmRepository } from "mobiletto-orm";
import { AccountType, AuthAccountTypeDef, SessionType, SessionTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export type SessionRepositoryType = MobilettoOrmRepository<SessionType> & {
  newSession: (account: AccountType) => Promise<SessionType>;
};

export const sessionRepository = (): SessionRepositoryType => {
  const baseRepo = ybRepo<SessionType>(SessionTypeDef);
  return {
    ...baseRepo,
    newSession: async (account: AccountType): Promise<SessionType> => {
      const accountId = AuthAccountTypeDef.id(account);
      return await baseRepo.create({
        token: generateId(accountId), // create will replace this, but it must pass validation
        account: accountId,
      });
    },
  };
};
