import { PrivateConfigType, PublicConfigType } from "yuebing-model";
import { Cached } from "~/server/utils/cached";
import { privateConfigRepository, publicConfigRepository } from "~/server/utils/repo/configRepo";
import { DEFAULT_PUBLIC_CONFIG, DEFAULT_PRIVATE_CONFIG } from "~/server/utils/default";

const HAS_ADMIN: Cached<boolean> = new Cached(
  async (): Promise<boolean> => {
    const admins = await accountRepository().safeFindBy("admin", true);
    const found = (admins && admins.length > 0) || false;
    if (found) {
      HAS_ADMIN.timeout = undefined;
    } else {
      HAS_ADMIN.timeout = 1000 * 20;
    }
    return found;
  },
  { name: "hasAdmin", default: false },
);

export const hasAdmin = async (): Promise<boolean> => {
  return HAS_ADMIN.get();
};

export const PUBLIC_CONFIG: Cached<PublicConfigType> = new Cached(
  async (): Promise<PublicConfigType> => {
    const admins = await accountRepository().safeFindBy("admin", true);
    return Object.assign({}, await publicConfigRepository().findSingleton(), {
      needsAdmin: !(await hasAdmin()),
    });
  },
  {
    name: "publicConfig",
    default: async <PublicConfigType>() =>
      Object.assign({}, DEFAULT_PUBLIC_CONFIG, {
        needsAdmin: !(await hasAdmin()),
      }) as PublicConfigType,
  },
);

export const PRIVATE_CONFIG: Cached<PrivateConfigType> = new Cached(
  async (): Promise<PrivateConfigType> => await privateConfigRepository().findSingleton(),
  { name: "privateConfig", default: DEFAULT_PRIVATE_CONFIG },
);

export const registrationEnabled = async (): Promise<boolean> => {
  return (await PUBLIC_CONFIG.get()).registrationEnabled;
};
