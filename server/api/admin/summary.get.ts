import { VOLUME_MOUNT_SOURCE, VOLUME_MOUNT_DESTINATION } from "yuebing-model";
import { AdminSummary } from "~/utils/admin";
import { PUBLIC_CONFIG } from "~/server/utils/config";

export default defineEventHandler(async (event) => {
  const publicConfig = await PUBLIC_CONFIG.get();

  const summary: AdminSummary = {
    site: {
      configured: !publicConfig.isDefault,
    },
    sources: {
      volumes: await volumeRepository().findBy("mount", VOLUME_MOUNT_SOURCE),
    },
    destinations: {
      volumes: await volumeRepository().findBy("mount", VOLUME_MOUNT_DESTINATION),
    },
    media: {
      drivers: [],
    },
    library: {
      libraries: [],
    },
  };
  return summary;
});
