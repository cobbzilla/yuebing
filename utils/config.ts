import { DEFAULT_ENCRYPTION_ALGO, PublicConfigType } from "yuebing-model";
import { useConfigStore } from "~/stores/configStore";

export const configTitle = (): string => useConfigStore().publicConfig?.title || "⌛🥮";

export const configUrl = (): string => useConfigStore().publicConfig?.siteUrl || "http://127.0.0.1:3000";

export const isSecure = (): boolean => configUrl().startsWith("https://");

export const configRegistrationEnabled = (): boolean => useConfigStore().publicConfig?.registrationEnabled || false;

export const isSetup = () => useRoute().path.startsWith("/setup");
export const isSignIn = () => useRoute().path.startsWith("/signIn");
export const isHome = () => useRoute().path.startsWith("/home");

export const configCiphers = (
  publicConfig: PublicConfigType,
): {
  values: string[];
  labels: string[];
  items: { value: string; label: string; title?: string; rawLabel: boolean }[];
} => {
  return publicConfig?.crypto?.ciphers
    ? {
        values: publicConfig?.crypto?.ciphers,
        labels: publicConfig?.crypto?.ciphers,
        items: publicConfig?.crypto?.ciphers.map((c: string) => ({
          label: c,
          value: c,
          rawLabel: true,
        })),
      }
    : {
        values: [DEFAULT_ENCRYPTION_ALGO],
        labels: [DEFAULT_ENCRYPTION_ALGO],
        items: [
          {
            value: DEFAULT_ENCRYPTION_ALGO,
            label: DEFAULT_ENCRYPTION_ALGO,
            title: DEFAULT_ENCRYPTION_ALGO,
            rawLabel: true,
          },
        ],
      };
};

export const DEFAULT_STORAGE_NAME = "~default~";

export const isDefaultStorage = (name: string) => name && DEFAULT_STORAGE_NAME === name;
