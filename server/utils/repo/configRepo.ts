import { PublicConfigTypeDef, PublicConfigType, PrivateConfigTypeDef, PrivateConfigType } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";
import { getCryptoConfig } from "~/server/utils/crypto";

const cryptoConfig = getCryptoConfig();

const PublicConfigTypeWithCiphers = PublicConfigTypeDef.extend({
  typeName: PublicConfigTypeDef.typeName,
  fields: {
    crypto: {
      fields: {
        ciphers: cryptoConfig,
      },
    },
  },
});

export const publicConfigRepository = () => ybRepo<PublicConfigType>(PublicConfigTypeWithCiphers);

export const privateConfigRepository = () => ybRepo<PrivateConfigType>(PrivateConfigTypeDef);
