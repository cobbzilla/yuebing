import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { AccountType, RegistrationType } from "yuebing-model";
import { currentLocaleForUser, FALLBACK_DEFAULT_LANG, localeMessagesForUser } from "yuebing-messages";
import { authService } from "~/utils/services/authService";
import { accountService } from "~/utils/services/model/accountService";

export const useSessionStore = defineStore("session", {
  state: () => ({
    user: ((useCookie(SESSION_COOKIE_NAME) && useCookie(SESSION_COOKIE_NAME).value) || {}) as AccountType,
    currentLocale: FALLBACK_DEFAULT_LANG,
    browserLocale: FALLBACK_DEFAULT_LANG,
    anonLocale: FALLBACK_DEFAULT_LANG,
  }),
  getters: {
    loggedIn: (state) => state.user && state.user.username,
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
      if (this.user.username) {
        this.user.locale = loc;
        await accountService.updateAccount(this.user);
        // todo: save user
      } else {
        this.anonLocale = loc;
      }
      this.currentLocale = currentLocaleForUser(this.user, this.browserLocale, this.anonLocale);
      // console.log(`setLocale: set currentLocale=${this.currentLocale} on this=${JSON.stringify(this)}`);
    },
    async login(usernameOrEmail: string, password: string, errors: Ref<MobilettoOrmValidationErrors>): Promise<void> {
      if (this.user.username) {
        throw new Error(`session.login: user already logged in: ${this.user.username}`);
      }
      const account = await authService.login({ usernameOrEmail, password }, errors);
      if (account) {
        this.user = account;
      }
    },
    async register(registration: RegistrationType, errors: Ref<MobilettoOrmValidationErrors>): Promise<void> {
      const account = await authService.register(registration, errors);
      if (account) {
        this.user = account;
      }
    },
    logout(): void {
      this.user = {} as AccountType;
      navigateTo("/");
    },
  },
});
