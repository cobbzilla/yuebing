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
import { sessionRepository } from "~/server/utils/repo/sessionRepo";
import { filterErrors, forbidden, validationError } from "~/server/utils/filter/errorHandler";
import { needsAdmin } from "~/server/utils/config";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";

export default defineEventHandler((event) =>
  filterErrors(event, "register", async (event) => {
    const adminInit = await needsAdmin();
    if (!(await registrationEnabled())) {
      if (adminInit) {
        logger.info("register: needsAdmin was true, allowing registration");
      } else {
        throw forbidden();
      }
    }

    const regRequest: RegistrationType = await readBody(event);

    const validated: RegistrationType = (await RegistrationTypeDef.validate(regRequest)) as RegistrationType;

    const username = validated.username;
    const email = validated.email;
    const repo: AccountRepositoryType = accountRepository();
    const errors: MobilettoOrmValidationErrors = {};

    if ((await repo.findByUsernameOrEmail(username)) != null) {
      errors.username = ["exists"];
    }
    if ((await repo.findByUsernameOrEmail(email)) != null) {
      errors.email = ["exists"];
    }
    if (Object.keys(errors).length > 0) {
      throw validationError(errors);
    }

    // only set admin flag for first admin
    validated.admin = adminInit;

    // create the account
    const account: AccountType = await accountRepository().create(validated);

    // start a session
    const sess: SessionType = await sessionRepository().newSession(account);
    const authAccount: AuthAccountType = {
      ...(AccountTypeDef.redact(account) as AccountType),
      session: sess.token,
    };
    return await setSessionCookie(event, AuthAccountTypeDef.redact(authAccount) as AuthAccountType);
  }),
);
