import { ZillaClock } from "zilla-util";
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

export const ServerLibraryScanType = (clock: ZillaClock) =>
  LibraryScanTypeDef.extend({
    fields: {
      scheduled: {
        test: {
          message: "scheduled_must_be_in_future",
          valid: (v) => typeof v.scheduled === "number" && v.scheduled > clock.now(),
        },
      },
    },
  });

export const libraryScanRepository = (clock: ZillaClock) => ybRepo<LibraryScanType>(ServerLibraryScanType(clock));

export const sourceScanRepository = () => ybRepo<SourceScanType>(SourceScanTypeDef);

export const sourceAssetRepository = () => ybRepo<SourceAssetType>(SourceAssetTypeDef);

export const profileJobRepository = () => ybRepo<ProfileJobType>(ProfileJobTypeDef);

export const uploadJobRepository = () => ybRepo<UploadJobType>(UploadJobTypeDef);
