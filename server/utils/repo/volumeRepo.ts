import { VolumeTypeDef, VolumeType } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export const volumeRepository = () => ybRepo<VolumeType>(VolumeTypeDef);
