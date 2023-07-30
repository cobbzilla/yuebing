import * as crypto from "crypto";

type CryptoItem = { value: string; label: string; rawLabel: boolean; info: string };

const CRYPTO_ALGO: {
  items: CryptoItem[];
  values: string[];
  labels: string[];
} = {
  items: [],
  values: [],
  labels: [],
};

export const getCryptoConfig = () => {
  const ciphers = crypto.getCiphers();
  if (CRYPTO_ALGO.items.length === 0) {
    CRYPTO_ALGO.items = ciphers
      .map((c: string) => crypto.getCipherInfo(c))
      .map((info) => {
        return info ? { value: info.name, label: info.name, rawLabel: true, info: JSON.stringify(info) } : null;
      })
      .filter((info) => !!info) as CryptoItem[];
    CRYPTO_ALGO.values = CRYPTO_ALGO.items.map((a) => a.value);
    CRYPTO_ALGO.labels = CRYPTO_ALGO.items.map((a) => a.label);
  }
  return CRYPTO_ALGO;
};
