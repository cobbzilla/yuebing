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
import { MobilettoOrmValidationError } from "mobiletto-orm";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";

export default defineEventHandler(async (event) => {
  const loginRequest: UsernameAndPasswordType = await readBody(event, {
    strict: true,
  });

  let validated;
  try {
    validated = UsernameAndPasswordTypeDef.validate(loginRequest);
  } catch (e) {
    if (e instanceof MobilettoOrmValidationError) {
      throw createError({
        statusCode: 422,
        statusMessage: "validation",
        data: JSON.stringify(e.errors),
      });
    }
  }

  const login = validated.usernameOrEmail;
  const password = validated.password;
  const repo: AccountRepositoryType = accountRepository();
  const account = await repo.findByUsernameOrEmail(login);
  if (!account) {
    return setResponseStatus(event, 404);
  }

  // note: account.password is the bcrypt'd password
  const match = await bcrypt.compare(password, account.password);
  if (!match) {
    return setResponseStatus(event, 404);
  }

  // start a session
  const sess: SessionType = await sessionRepository().newSession(account);
  const authAccount: AuthAccountType = {
    ...(AccountTypeDef.redact(account) as AccountType),
    session: sess.token,
  };

  return AuthAccountTypeDef.redact(authAccount);
});
