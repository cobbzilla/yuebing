import { defineStore } from "pinia";
import { PublicConfigTypeDef, PrivateConfigTypeDef, PublicConfigType, PrivateConfigType } from "yuebing-model";
import { configService } from "~/utils/services/configService";

export const useConfigStore = defineStore("config", {
  state: () => ({
    browserHeaders: null as Record<string, string> | null,
    publicConfig: null as PublicConfigTypeDef | null,
    privateConfig: null as PrivateConfigTypeDef | null,
  }),
  actions: {
    async loadBrowserHeaders(): Promise<Record<string, string>> {
      if (this.browserHeaders == null) {
        this.browserHeaders = await configService.browserHeaders();
      }
      return this.browserHeaders;
    },
    async loadPublicConfig(): Promise<PublicConfigType> {
      if (this.publicConfig == null) {
        this.publicConfig = await configService.loadPublicConfig();
      }
      return this.publicConfig;
    },
    async loadPrivateConfig(): Promise<PrivateConfigType> {
      if (this.privateConfig == null) {
        this.privateConfig = await configService.loadPrivateConfig();
      }
      return this.privateConfig;
    },
    async refresh(): Promise<void> {
      if (this.publicConfig != null) {
        this.publicConfig = await configService.loadPublicConfig();
      }
      if (this.privateConfig != null) {
        this.privateConfig = await configService.loadPrivateConfig();
      }
    },
  },
});
