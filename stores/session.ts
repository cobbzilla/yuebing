import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm-typedef";
import { AccountType, AuthAccountType, RegistrationType } from "yuebing-model";
import { currentLocaleForUser, FALLBACK_DEFAULT_LANG, localeMessagesForUser } from "yuebing-messages";
import { authService } from "~/utils/services/authService";
import { accountService } from "~/utils/services/model/accountService";
import { sessionService } from "~/utils/services/sessionService";
import { useConfigStore } from "~/stores/config";
import { sessionCookie } from "~/utils/auth";
import { isSecure } from "~/utils/config";

const initialUserObject = (): AuthAccountType => {
  const ck = sessionCookie(isSecure());
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
    needsRefresh: (state) =>
      state.user &&
      state.user.session &&
      (!state.user.invalidSession || state.user.invalidSession !== state.user.session) &&
      !state.user.username,
    admin: (state) => state.user && state.user.username && state.user.session && state.user.admin === true,
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
    async setLocale(loc: string, skipUpdate?: boolean): Promise<void> {
      if (this.user.session) {
        this.user.locale = loc;
        if (!skipUpdate) {
          await accountService.updateAccount(this.user);
        }
      } else {
        this.anonLocale = loc;
      }
      this.currentLocale = currentLocaleForUser(this.user, this.browserLocale, this.anonLocale);
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
        useConfigStore()
          .refresh()
          .then(() => {
            navigateTo("/home");
          });
      }
      return account;
    },
    async register(
      registration: RegistrationType,
      errors: Ref<MobilettoOrmValidationErrors>,
    ): Promise<AuthAccountType> {
      if (this.loggedIn) {
        navigateTo("/home");
        return this.user;
      }
      const account: AuthAccountType = await authService.register(registration, errors);
      if (account) {
        this.user = account;
        useConfigStore()
          .refresh()
          .then(() => {
            navigateTo("/home");
          });
      }
      return account;
    },
    async getAccount(): Promise<AuthAccountType> {
      const account: AuthAccountType = await sessionService.getAccount();
      if (account) {
        if (Object.keys(account).length === 0) {
          this.user.invalidSession = this.user.session;
          if (!useRoute().path.startsWith("/signIn")) {
            navigateTo("/signIn");
          }
        } else {
          this.user = account;
        }
      }
      return account;
    },
    logout(): void {
      authService.logout().then((ok) => {
        if (ok) {
          this.user = {} as AccountType;
          useConfigStore()
            .refresh()
            .then(() => {
              navigateTo("/");
            });
        }
      });
    },
  },
});
