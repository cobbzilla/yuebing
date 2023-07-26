import { generateId, MobilettoOrmError, MobilettoOrmRepository, MobilettoOrmTypeDef, sha } from "mobiletto-orm";
import { AccountType, AuthAccountTypeDef, SessionType, SessionTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export type SessionRepositoryType = MobilettoOrmRepository<SessionType> & {
  newSession: (account: AccountType) => Promise<SessionType>;
};

const REPO: { r: SessionRepositoryType | null } = {
  r: null,
};

export const sessionRepository = () => {
  if (REPO.r == null) {
    REPO.r = {
      ...ybRepo<SessionType>(SessionTypeDef),
      newSession: async (account: AccountType): Promise<SessionType> => {
        if (!REPO.r) {
          throw new MobilettoOrmError("sessionRepository not initialized");
        }
        const accountId = AuthAccountTypeDef.id(account);
        return await REPO.r.create({
          token: generateId(accountId), // create will replace this, but it must pass validation
          account: accountId,
        });
      },
    };
  }
  return REPO.r;
};
