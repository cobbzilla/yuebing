import * as md5 from "md5";

import { AccountType as Account } from "yuebing-model";

export const ACCOUNT_SORT: Record<
  string,
  (u1: Account, u2: Account) => number
> = {
  email: (u1: Account, u2: Account) =>
    u1.email && u2.email ? u1.email.localeCompare(u2.email) : u1.email ? -1 : 0,
  firstName: (u1: Account, u2: Account) =>
    u1.firstName && u2.firstName
      ? u1.firstName.localeCompare(u2.firstName)
      : u1.firstName
      ? -1
      : 0,
  lastName: (u1: Account, u2: Account) =>
    u1.lastName && u2.lastName
      ? u1.lastName.localeCompare(u2.lastName)
      : u1.lastName
      ? -1
      : 0,
  locale: (u1: Account, u2: Account) =>
    u1.locale && u2.locale
      ? u1.locale.localeCompare(u2.locale)
      : u1.locale
      ? -1
      : 0,
  ctime: (u1: Account, u2: Account) =>
    u1._meta && u1._meta.ctime && u2._meta && u2._meta.ctime
      ? u1._meta.ctime - u2._meta.ctime
      : u1._meta && u1._meta.ctime
      ? -1
      : 0,
  mtime: (u1: Account, u2: Account) =>
    u1._meta && u1._meta.mtime && u2._meta && u2._meta.mtime
      ? u1._meta.mtime - u2._meta.mtime
      : u1._meta && u1._meta.mtime
      ? -1
      : 0,
};

export const AccountSortFields = () => Object.keys(ACCOUNT_SORT);

export const localizedAccountSortFields = (messages: Record<string, string>) =>
  AccountSortFields().map((f) => {
    return { name: f, message: messages["label_" + f] };
  });

export const sortByField = (
  array: Account[],
  field: string,
  ascending: boolean,
) =>
  ascending
    ? array.sort(ACCOUNT_SORT[field])
    : array.sort(ACCOUNT_SORT[field]).reverse();

const GRAVATAR_RATING_LEVEL = "r";
const GRAVATAR_DEFAULT_IMAGE = "retro";

const gravatarEmailHash = (email: string) =>
  email ? md5(email.trim().toLowerCase()) : null;
const gravatarEmailUrl = (email: string) =>
  email
    ? `https://www.gravatar.com/avatar/${gravatarEmailHash(
        email,
      )}?d=${encodeURIComponent(
        GRAVATAR_DEFAULT_IMAGE,
      )}&r=${GRAVATAR_RATING_LEVEL}`
    : null;
