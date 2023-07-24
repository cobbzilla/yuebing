import { defineStore } from "pinia";
import { RegistrationType } from "yuebing-model";
import { MIN_ID_LENGTH } from "mobiletto-orm-typedef";
import { currentLocaleForUser, FALLBACK_DEFAULT_LANG, localeMessagesForUser } from "yuebing-messages";
import { USER_LOCAL_STORAGE_KEY } from "~/utils/services/serviceUtil";
import { authService } from "~/utils/services/authService";

export const localStorageUser = () => JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY) || "null");

export const useSessionStore = defineStore("session", {
  state: () => ({
    user: localStorageUser(),
    userStatus: { loggedIn: !!localStorageUser(), loggingIn: false, registering: false },
    currentLocale: FALLBACK_DEFAULT_LANG,
    browserLocale: FALLBACK_DEFAULT_LANG,
    anonLocale: FALLBACK_DEFAULT_LANG,
  }),
  getters: {
    loggedIn: (state) => state.user && state.userStatus && state.userStatus.loggedIn,
    admin: (state) => state.userStatus.loggedIn && state.user?.admin,
    locale: (state) =>
      state.user && state.userStatus.loggedIn && state.user.locale
        ? state.user.locale
        : state.anonLocale
        ? state.anonLocale
        : state.browserLocale
        ? state.browserLocale
        : FALLBACK_DEFAULT_LANG,
    localeMessages: (state) => localeMessagesForUser(state.user, state.browserLocale, state.anonLocale),
  },
  actions: {
    setLocale(loc: string): void {
      if (this.user && this.userStatus.loggedIn) {
        this.user.locale = loc;
        // todo: save user
      } else {
        this.anonLocale = loc;
      }
      this.currentLocale = currentLocaleForUser(this.user, this.browserLocale, this.anonLocale);
      // console.log(`setLocale: set currentLocale=${this.currentLocale} on this=${JSON.stringify(this)}`);
    },
    async login(usernameOrEmail: string, password: string): Promise<void> {
      this.userStatus.loggingIn = true;
      try {
        const account = await authService.login({ usernameOrEmail, password });
        if (account) {
          this.user = account;
          this.userStatus.loggedIn = (account.session && account.session.length > MIN_ID_LENGTH) || false;
        }
      } finally {
        this.userStatus.loggingIn = false;
      }
    },
    async register(registration: RegistrationType): Promise<void> {
      this.userStatus.registering = true;
      try {
        const account = await authService.register(registration);
        if (account) {
          this.user = account;
          this.userStatus.loggedIn = account.token && account.token.length > MIN_ID_LENGTH;
        }
      } finally {
        this.userStatus.registering = false;
      }
    },
    logout(): void {
      localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      this.user = null;
      this.userStatus.loggedIn = false;
      navigateTo("/");
    },
  },
});
