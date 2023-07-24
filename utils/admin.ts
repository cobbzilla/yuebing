import { VolumeType } from "yuebing-model";

export type AdminSummary = {
  site: {
    configured: boolean;
  };
  sources: {
    volumes: VolumeType[];
  };
  destinations: {
    volumes: VolumeType[];
  };
  media: {
    drivers: string[];
  };
  library: {
    libraries: string[];
  };
};
