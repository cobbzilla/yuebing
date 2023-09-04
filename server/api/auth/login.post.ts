import * as bcrypt from "bcrypt";
import { FIND_NOREDACT } from "mobiletto-orm";
import {
  AccountType,
  AccountTypeDef,
  AuthAccountType,
  AuthAccountTypeDef,
  SessionType,
  UsernameAndPasswordType,
  UsernameAndPasswordTypeDef,
} from "yuebing-model";
import { accountRepository, AccountRepositoryType } from "~/server/utils/repo/accountRepo";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";
import { filterErrors, notFound } from "~/server/utils/filter/errorFilter";

async function checkPassword(passwordProvided: string, accountPassword: string) {
  try {
    return await bcrypt.compare(passwordProvided, accountPassword);
  } catch (e) {
    logger.error(`checkPassword: bcrypt error=${e}`);
    return false;
  }
}

export default defineEventHandler((event) =>
  filterErrors(event, "logout", async (event) => {
    const loginRequest: UsernameAndPasswordType = await readBody(event);

    const validated: UsernameAndPasswordType = (await UsernameAndPasswordTypeDef.validate(
      loginRequest,
    )) as UsernameAndPasswordType;

    const login = validated.usernameOrEmail;
    const password = validated.password;
    const repo: AccountRepositoryType = accountRepository();
    const account = await repo.findByUsernameOrEmail(login, FIND_NOREDACT);
    if (!account) {
      throw notFound("usernameOrEmail");
    }

    // note: account.password is the bcrypt'd password
    const match = await checkPassword(password, account.password);
    if (!match) {
      throw notFound("usernameOrEmail");
    }

    // start a session
    const sess: SessionType = await sessionRepository().newSession(account);
    const authAccount: AuthAccountType = {
      ...(AccountTypeDef.redact(account) as AccountType),
      session: sess.token,
    };
    return await setSessionCookie(event, AuthAccountTypeDef.redact(authAccount) as AuthAccountType);
  }),
);
