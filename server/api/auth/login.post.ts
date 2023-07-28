import {
  AccountType,
  AccountTypeDef,
  AuthAccountType,
  AuthAccountTypeDef,
  SessionType,
  UsernameAndPasswordType,
  UsernameAndPasswordTypeDef,
} from "yuebing-model";
import * as bcrypt from "bcrypt";
import { accountRepository, AccountRepositoryType } from "~/server/utils/repo/accountRepo";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";
import { filterErrors, notFound } from "~/server/utils/filter/errorFilter";
import {FIND_NOREDACT} from "mobiletto-orm";

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
      throw notFound(login);
    }

    // note: account.password is the bcrypt'd password
    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      throw notFound(login);
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
