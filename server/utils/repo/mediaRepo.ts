import { MediaProfileType, MediaProfileTypeDef, MediaType, MediaTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export const mediaRepository = () => ybRepo<MediaType>(MediaTypeDef);

export const mediaProfileRepository = () => ybRepo<MediaProfileType>(MediaProfileTypeDef);
