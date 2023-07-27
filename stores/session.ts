import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { AccountType, AuthAccountType, RegistrationType } from "yuebing-model";
import { currentLocaleForUser, FALLBACK_DEFAULT_LANG, localeMessagesForUser } from "yuebing-messages";
import { authService } from "~/utils/services/authService";
import { accountService } from "~/utils/services/model/accountService";
import { sessionService } from "~/utils/services/sessionService";

const initialUserObject = (): AuthAccountType => {
  const ck = useCookie(SESSION_COOKIE_NAME);
  if (ck && ck.value) {
    return { session: ck.value } as AuthAccountType;
  }
  return {} as AuthAccountType;
};

export const useSessionStore = defineStore("session", {
  state: () => ({
    user: initialUserObject(),
    currentLocale: FALLBACK_DEFAULT_LANG,
    browserLocale: FALLBACK_DEFAULT_LANG,
    anonLocale: FALLBACK_DEFAULT_LANG,
  }),
  getters: {
    loggedIn: (state) => state.user && state.user.username && state.user.session,
    needsRefresh: (state) => state.user && state.user.session && !state.user.username,
    admin: (state) => state.user && state.user?.admin,
    locale: (state) =>
      state.user && state.user.locale
        ? state.user.locale
        : state.anonLocale
        ? state.anonLocale
        : state.browserLocale
        ? state.browserLocale
        : FALLBACK_DEFAULT_LANG,
    localeMessages: (state) => localeMessagesForUser(state.user, state.browserLocale, state.anonLocale),
  },
  actions: {
    async setLocale(loc: string): Promise<void> {
      if (this.user.session) {
        this.user.locale = loc;
        await accountService.updateAccount(this.user);
      } else {
        this.anonLocale = loc;
      }
      this.currentLocale = currentLocaleForUser(this.user, this.browserLocale, this.anonLocale);
      // console.log(`setLocale: set currentLocale=${this.currentLocale} on this=${JSON.stringify(this)}`);
    },
    async login(
      usernameOrEmail: string,
      password: string,
      errors: Ref<MobilettoOrmValidationErrors>,
    ): Promise<AuthAccountType> {
      if (this.user.session) {
        console.warn(`session.login: user already logged in: ${this.user.username} (refreshing)`);
      }
      const account: AuthAccountType = await authService.login({ usernameOrEmail, password }, errors);
      if (account) {
        this.user = account;
        navigateTo("/home");
      }
      return account;
    },
    async register(
      registration: RegistrationType,
      errors: Ref<MobilettoOrmValidationErrors>,
    ): Promise<AuthAccountType> {
      const account: AuthAccountType = await authService.register(registration, errors);
      if (account) {
        this.user = account;
        navigateTo("/home");
      }
      return account;
    },
    async getAccount(): Promise<AuthAccountType> {
      const account: AuthAccountType = await sessionService.getAccount();
      if (account) {
        this.user = account;
      }
      return account;
    },
    logout(): void {
      authService.logout().then((ok) => {
        if (ok) {
          this.user = {} as AccountType;
          navigateTo("/");
        }
      });
    },
  },
});
