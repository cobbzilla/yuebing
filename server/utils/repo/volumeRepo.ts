import { DestinationType, DestinationTypeDef, SourceType, SourceTypeDef } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export const sourceRepository = () => ybRepo<SourceType>(SourceTypeDef);
export const destinationRepository = () => ybRepo<DestinationType>(DestinationTypeDef);
