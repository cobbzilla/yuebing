import { H3Event } from "h3";
import { AccountType, SessionType } from "yuebing-model";
import { SESSION_HEADER } from "~/utils/auth";
import { forbidden } from "~/server/utils/filter/errorFilter";
import { sessionRepository } from "~/server/utils/repo/sessionRepo";
import { accountRepository } from "~/server/utils/repo/accountRepo";

export const requireAccount = async (
  event: H3Event,
  _logPrefix: string,
  fn: (event: H3Event, session: SessionType) => Promise<unknown>,
) => {
  if (!event?.req?.headers[SESSION_HEADER]) {
    throw forbidden();
  }
  const token = event?.req?.headers[SESSION_HEADER];
  const session: SessionType | null = await sessionRepository().safeFindById(token);
  if (!session) throw forbidden();
  return fn(event, session);
};

export const requireAccountObject = async (
  event: H3Event,
  logPrefix: string,
  fn: (event: H3Event, session: SessionType, account: AccountType) => Promise<unknown>,
) => {
  return requireAccount(event, logPrefix, async (event, session) => {
    const account: AccountType | null = await accountRepository().safeFindById(session.account);
    if (!account) throw forbidden();
    return fn(event, session, account);
  });
};

export const requireAdminAccountObject = async (
  event: H3Event,
  logPrefix: string,
  fn: (event: H3Event, session: SessionType, account: AccountType) => Promise<unknown>,
) => {
  return requireAccountObject(event, logPrefix, (event, session: SessionType, account: AccountType) => {
    if (account.admin === true) {
      return fn(event, session, account);
    } else {
      throw forbidden();
    }
  });
};
