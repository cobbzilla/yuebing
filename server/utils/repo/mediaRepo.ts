import { MobilettoOrmRepository } from "mobiletto-orm";
import { MediaProfileType, MediaProfileTypeDef, MediaType, MediaTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";
import { initializeMediaPlugins } from "~/server/utils/media";

export const mediaRepository = () => {
  const mediaRepo: MobilettoOrmRepository<MediaType> = ybRepo<MediaType>(MediaTypeDef);
  if (!mediaRepo.initialize) {
    const mediaProfileRepo: MobilettoOrmRepository<MediaProfileType> = mediaProfileRepository();
    mediaRepo.initialize = () => initializeMediaPlugins(mediaRepo, mediaProfileRepo);
  }
  return mediaRepo;
};

export const mediaProfileRepository = () => ybRepo<MediaProfileType>(MediaProfileTypeDef);
