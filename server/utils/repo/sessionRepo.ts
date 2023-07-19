import { AccountType, AuthAccountTypeDef, SessionType, SessionTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";
import { MobilettoOrmError, MobilettoOrmRepository } from "mobiletto-orm";

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
        return REPO.r.create({
          token: "", // create will fill this out
          account: AuthAccountTypeDef.id(account),
        });
      },
    };
  }
  return REPO.r;
};
