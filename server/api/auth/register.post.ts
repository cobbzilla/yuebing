import {
  AccountType,
  AccountTypeDef,
  AuthAccountType,
  AuthAccountTypeDef,
  SessionType,
  RegistrationType,
  RegistrationTypeDef,
} from "yuebing-model";
import { accountRepository, AccountRepositoryType } from "~/server/utils/repo/accountRepo";
import { MobilettoOrmValidationError, ValidationErrors } from "mobiletto-orm";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";

export default defineEventHandler(async (event) => {
  if (!(await registrationEnabled())) {
    throw createError({ statusCode: 403 });
  }

  const regRequest: RegistrationType = await readBody(event, {
    strict: true,
  });

  let validated: RegistrationType | null = null;
  try {
    validated = RegistrationTypeDef.validate(regRequest);
  } catch (e) {
    if (e instanceof MobilettoOrmValidationError) {
      throw createError({
        statusCode: 422,
        statusMessage: "validation",
        data: JSON.stringify(e.errors),
      });
    }
  }
  if (!validated) {
    throw createError({
      statusCode: 422,
      statusMessage: "validation",
    });
  }

  const username = validated.username;
  const email = validated.email;
  const repo: AccountRepositoryType = accountRepository();
  const errors: ValidationErrors = {};

  if ((await repo.findByUsernameOrEmail(username)) != null) {
    errors.username = ["exists"];
  }
  if ((await repo.findByUsernameOrEmail(email)) != null) {
    errors.email = ["exists"];
  }
  if (Object.keys(errors).length > 0) {
    throw createError({
      statusCode: 422,
      statusMessage: "validation",
      data: JSON.stringify(errors),
    });
  }

  // create the account
  const account: AccountType = await accountRepository().create(validated);

  // start a session
  const sess: SessionType = await sessionRepository().newSession(account);
  const authAccount: AuthAccountType = {
    ...(AccountTypeDef.redact(account) as AccountType),
    session: sess.token,
  };

  return AuthAccountTypeDef.redact(authAccount);
});
