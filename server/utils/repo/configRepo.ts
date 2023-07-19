import { PublicConfigTypeDef, PublicConfigType, PrivateConfigTypeDef, PrivateConfigType } from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export const publicConfigRepository = () => ybRepo<PublicConfigType>(PublicConfigTypeDef);

export const privateConfigRepository = () => ybRepo<PrivateConfigType>(PrivateConfigTypeDef);
