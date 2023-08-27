import {
  LibraryScanType,
  LibraryScanTypeDef,
  ProfileJobType,
  ProfileJobTypeDef,
  SourceAssetType,
  SourceAssetTypeDef,
  SourceScanType,
  SourceScanTypeDef,
  UploadJobType,
  UploadJobTypeDef,
} from "yuebing-model";
import { ybRepo } from "~/server/utils/system";

export const libraryScanRepository = () => ybRepo<LibraryScanType>(LibraryScanTypeDef);

export const sourceScanRepository = () => ybRepo<SourceScanType>(SourceScanTypeDef);

export const sourceAssetRepository = () => ybRepo<SourceAssetType>(SourceAssetTypeDef);

export const profileJobRepository = () => ybRepo<ProfileJobType>(ProfileJobTypeDef);

export const uploadJobRepository = () => ybRepo<UploadJobType>(UploadJobTypeDef);
