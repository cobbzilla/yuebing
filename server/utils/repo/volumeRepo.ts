import { DestinationType, DestinationTypeDef, SourceType, SourceTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";
import { getCryptoConfig } from "~/server/utils/crypto";

const cryptoConfig = getCryptoConfig();

const encryptionFields = {
  encryption: {
    fields: {
      encryptionAlgo: cryptoConfig,
    },
  },
};

const SourceTypeDefWithCrypto = SourceTypeDef.extend({
  typeName: SourceTypeDef.typeName,
  fields: encryptionFields,
});

export const sourceRepository = () => ybRepo<SourceType>(SourceTypeDefWithCrypto);

const DestinationTypeDefWithCrypto = DestinationTypeDef.extend({
  typeName: DestinationTypeDef.typeName,
  fields: encryptionFields,
});

export const destinationRepository = () => ybRepo<DestinationType>(DestinationTypeDefWithCrypto);
