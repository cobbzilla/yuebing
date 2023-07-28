import { useConfigStore } from "~/stores/config";

export const configTitle = (): string => useConfigStore().publicConfig?.title || "⌛🥮";

export const configUrl = (): string => useConfigStore().publicConfig?.siteUrl || "http://127.0.0.1:3000";

export const isSecure = (): boolean => configUrl().startsWith("https://");

export const configRegistrationEnabled = (): boolean => useConfigStore().publicConfig?.registrationEnabled || false;

export const isSetup = () => useRoute().path.startsWith("/setup");
export const isSignIn = () => useRoute().path.startsWith("/signIn");
export const isHome = () => useRoute().path.startsWith("/home");
