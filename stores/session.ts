import { defineStore } from 'pinia'
import {USER_LOCAL_STORAGE_KEY} from "~/utils/constants";
import {navigateTo} from "#app";

export const localStorageUser = () => JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY) || 'null')

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: localStorageUser(),
    userStatus: { loggedIn: !!localStorageUser() },
    currentLocale: DEFAULT_LOCALE,
    browserLocale: DEFAULT_LOCALE,
    anonLocale: DEFAULT_LOCALE
  }),
  getters: {
    loggedIn: (state) => state.user && state.userStatus && state.userStatus.loggedIn,
    admin: (state) => state.userStatus.loggedIn && state.user?.admin,
    locale: (state) => state.user && state.userStatus.loggedIn && state.user.locale
      ? state.user.locale
      : state.anonLocale
        ? state.anonLocale
        : state.browserLocale
          ? state.browserLocale
          : DEFAULT_LOCALE,
    localeMessages: (state) => localeMessagesForUser(state.user, state.browserLocale, state.anonLocale)
  },
  actions: {
    setLocale(loc : string) : void {
      if (this.user && this.userStatus.loggedIn) {
        this.user.locale = loc
        // todo: save user
      } else {
        this.anonLocale = loc
      }
    },
    logout() : void {
      localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
      this.user = null
      this.userStatus.loggedIn = false
      navigateTo('/')
    }
  },
})
