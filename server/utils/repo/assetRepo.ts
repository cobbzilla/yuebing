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
import { SCAN_CONFIG, ybRepo } from "~/server/utils/system";

export const ServerLibraryScanType = (clock: ZillaClock) =>
  LibraryScanTypeDef.extend({
    fields: {
      scheduled: {
        test: {
          message: "scheduled_must_be_in_future",
          valid: (v) => v.status !== "pending" || (typeof v.scheduled === "number" && v.scheduled > clock.now()),
        },
      },
    },
  });

export const libraryScanRepository = (clock: ZillaClock) => {
  const { create, ...baseRepo } = ybRepo<LibraryScanType>(ServerLibraryScanType(clock));
  return {
    ...baseRepo,
    create: async (libScan: LibraryScanType): Promise<LibraryScanType> => {
      const created = await create(libScan);
      SCAN_CONFIG.awaken();
      return created;
    },
  };
};

export const sourceScanRepository = () => ybRepo<SourceScanType>(SourceScanTypeDef);

export const sourceAssetRepository = () => ybRepo<SourceAssetType>(SourceAssetTypeDef);

export const profileJobRepository = () => ybRepo<ProfileJobType>(ProfileJobTypeDef);

export const uploadJobRepository = () => ybRepo<UploadJobType>(UploadJobTypeDef);
