import * as bcrypt from "bcrypt";
import {
  DEFAULT_BCRYPT_TIME_TARGET,
  DEFAULT_ENCRYPTION_ALGO,
  PrivateConfigType,
  PublicConfigType,
} from "yuebing-model";
import { Cached } from "~/server/utils/cached";
import { privateConfigRepository, publicConfigRepository } from "~/server/utils/repo/configRepo";
import { DEFAULT_PUBLIC_CONFIG, DEFAULT_PRIVATE_CONFIG } from "~/server/utils/default";
import { rand } from "mobiletto-orm";
import crypto from "crypto";

export const HAS_ADMIN: Cached<boolean> = new Cached(
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
  { name: "hasAdmin", default: false, timeout: 60000 },
);

export const hasAdmin = (): Promise<boolean> => {
  return HAS_ADMIN.get();
};

export const PUBLIC_CONFIG: Cached<PublicConfigType> = new Cached(
  async (): Promise<PublicConfigType> => {
    return Object.assign({}, await publicConfigRepository().findSingleton(), {
      needsAdmin: !(await hasAdmin()),
      crypto: { ciphers: crypto.getCiphers() },
    });
  },
  {
    name: "publicConfig",
    timeout: 60000,
    default: async <PublicConfigType>() =>
      Object.assign({}, DEFAULT_PUBLIC_CONFIG, {
        needsAdmin: !(await hasAdmin()),
        crypto: { ciphers: crypto.getCiphers() },
      }) as PublicConfigType,
  },
);

export const PRIVATE_CONFIG: Cached<PrivateConfigType> = new Cached(
  async (): Promise<PrivateConfigType> => await privateConfigRepository().findSingleton(),
  { name: "privateConfig", default: DEFAULT_PRIVATE_CONFIG, timeout: 60000 },
);

export const registrationEnabled = async (): Promise<boolean> =>
  (await PUBLIC_CONFIG.get()).registrationEnabled || false;

export const needsAdmin = async (): Promise<boolean> => (await PUBLIC_CONFIG.get()).needsAdmin || false;

export const bcryptTimeTarget = async (): Promise<number> =>
  (await PRIVATE_CONFIG.get()).auth?.bcryptTimeTarget || DEFAULT_BCRYPT_TIME_TARGET;

const bcryptStartRounds = 8;
const bcryptDurations: Record<number, number> = {};

export const bcryptRounds = async (): Promise<number> => {
  const target = await bcryptTimeTarget();
  const data = rand(128);
  for (let rounds = bcryptStartRounds; true; rounds++) {
    if (!bcryptDurations[rounds]) {
      const start = Date.now();
      await bcrypt.hash(data, rounds);
      bcryptDurations[rounds] = Date.now() - start;
    }
    if (bcryptDurations[rounds] >= target) return rounds + 1;
  }
};
