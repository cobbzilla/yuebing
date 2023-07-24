import { defineStore } from "pinia";
import { PublicConfigTypeDef, PrivateConfigTypeDef } from "yuebing-model";
import { configService } from "~/utils/services/configService";

export const useConfigStore = defineStore("config", {
  state: () => ({
    browserHeaders: null as Record<string, string> | null,
    publicConfig: null as PublicConfigTypeDef | null,
    privateConfig: null as PrivateConfigTypeDef | null,
  }),
  actions: {
    async loadBrowserHeaders(): Promise<void> {
      if (this.browserHeaders == null) {
        this.browserHeaders = await configService.browserHeaders();
      }
    },
    async loadPublicConfig(): Promise<void> {
      if (this.publicConfig == null) {
        this.publicConfig = await configService.loadPublicConfig();
      }
    },
    async loadPrivateConfig(): Promise<void> {
      if (this.privateConfig == null) {
        this.privateConfig = await configService.loadPrivateConfig();
      }
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
