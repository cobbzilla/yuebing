import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { AccountType, AuthAccountType, RegistrationType } from "yuebing-model";
import { currentLocaleForAccount, FALLBACK_DEFAULT_LANG, localeMessagesForAccount } from "yuebing-messages";
import { authService } from "~/utils/services/authService";
import { accountService } from "~/utils/services/model/accountService";
import { sessionService } from "~/utils/services/sessionService";
import { useConfigStore } from "~/stores/config";
import { sessionCookie } from "~/utils/auth";
import { isSecure } from "~/utils/config";

const initialAccountObject = (): AuthAccountType => {
  const ck = sessionCookie(isSecure());
  if (ck && ck.value) {
    return { session: ck.value } as AuthAccountType;
  }
  return { session: null } as AuthAccountType;
};

export const useSessionStore = defineStore("session", {
  state: () => ({
    account: initialAccountObject(),
    currentLocale: FALLBACK_DEFAULT_LANG,
    browserLocale: FALLBACK_DEFAULT_LANG,
    anonLocale: FALLBACK_DEFAULT_LANG,
  }),
  getters: {
    loggedIn: (state) => state.account && state.account.username && state.account.session,
    needsRefresh: (state) =>
      state.account &&
      state.account.session &&
      (!state.account.invalidSession || state.account.invalidSession !== state.account.session) &&
      !state.account.username,
    admin: (state) => state.account && state.account.username && state.account.session && state.account.admin === true,
    locale: (state) =>
      state.account && state.account.locale
        ? state.account.locale
        : state.anonLocale
        ? state.anonLocale
        : state.browserLocale
        ? state.browserLocale
        : FALLBACK_DEFAULT_LANG,
    localeMessages: (state) => localeMessagesForAccount(state.account, state.browserLocale, state.anonLocale),
  },
  actions: {
    async setLocale(loc: string, skipUpdate?: boolean): Promise<void> {
      if (this.account.session) {
        this.account.locale = loc;
        if (!skipUpdate) {
          await accountService.updateAccount(this.account);
        }
      } else {
        this.anonLocale = loc;
      }
      this.currentLocale = currentLocaleForAccount(this.account, this.browserLocale, this.anonLocale);
    },
    async login(
      usernameOrEmail: string,
      password: string,
      errors: Ref<MobilettoOrmValidationErrors>,
    ): Promise<AuthAccountType> {
      if (this.account.session) {
        console.warn(`session.login: user already logged in: ${this.account.username} (refreshing)`);
      }
      const account: AuthAccountType = await authService.login({ usernameOrEmail, password }, errors);
      if (account) {
        this.account = account;
        await useConfigStore().refresh();
      }
      return account;
    },
    async register(
      registration: RegistrationType,
      errors: Ref<MobilettoOrmValidationErrors>,
    ): Promise<AuthAccountType> {
      if (this.loggedIn) {
        return this.account;
      }
      const account: AuthAccountType = await authService.register(registration, errors);
      if (account) {
        this.account = account;
        await useConfigStore().refresh();
      }
      return account;
    },
    async getAccount(): Promise<AuthAccountType> {
      if (!this.account.invalidSession) {
        const account: AuthAccountType = await sessionService.getAccount();
        if (account) {
          if (Object.keys(account).length === 0) {
            console.log("getAccount: setting invalidSession")
            this.account.invalidSession = this.account.session;
          } else {
            this.account = account;
          }
        }
      }
      return this.account;
    },
    async logout(): Promise<void> {
      if (await authService.logout()) {
        this.account = {} as AccountType;
        await useConfigStore().refresh();
      }
    },
  },
});
