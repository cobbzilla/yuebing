import { PrivateConfigType, PublicConfigType } from "yuebing-model";
import { Cached } from "~/server/utils/cached";
import { privateConfigRepository, publicConfigRepository } from "~/server/utils/repo/configRepo";
import { DEFAULT_PUBLIC_CONFIG, DEFAULT_PRIVATE_CONFIG } from "~/server/utils/default";

export const PUBLIC_CONFIG: Cached<PublicConfigType> = new Cached(
  async (): Promise<PublicConfigType> => await publicConfigRepository().findSingleton(),
  { name: "publicConfig", default: DEFAULT_PUBLIC_CONFIG },
);

export const PRIVATE_CONFIG: Cached<PrivateConfigType> = new Cached(
  async (): Promise<PrivateConfigType> => await privateConfigRepository().findSingleton(),
  { name: "privateConfig", default: DEFAULT_PRIVATE_CONFIG },
);

export const registrationEnabled = async (): Promise<boolean> => {
  return (await PUBLIC_CONFIG.get()).registrationEnabled;
};
