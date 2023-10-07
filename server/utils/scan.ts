import { DEFAULT_CLOCK } from "zilla-util";
import { logger } from "mobiletto-base";
import { YbScanConfig, YbScanner } from "yuebing-scan";
import { connectVolume } from "yuebing-server-util";

import { getLocalConfig } from "~/server/utils/config";
import { localConfigRepository } from "~/server/utils/repo/configRepo";
import { mediaRepository, mediaProfileRepository } from "~/server/utils/repo/mediaRepo";
import { libraryRepository } from "~/server/utils/repo/libraryRepo";
import {
  libraryScanRepository,
  sourceScanRepository,
  sourceAssetRepository,
  profileJobRepository,
  uploadJobRepository,
} from "~/server/utils/repo/assetRepo";
import { sourceRepository, destinationRepository } from "~/server/utils/repo/volumeRepo";

export const loadScanConfig = async (): Promise<YbScanConfig> => {
  const localConfigRepo = localConfigRepository();
  const localConfig = await getLocalConfig();
  const sourceRepo = sourceRepository();
  const mediaRepo = mediaRepository();
  const mediaProfileRepo = mediaProfileRepository();
  const libraryRepo = libraryRepository();
  const libraryScanRepo = libraryScanRepository(DEFAULT_CLOCK);
  const sourceScanRepo = sourceScanRepository();
  const destinationRepo = destinationRepository();
  const sourceAssetRepo = sourceAssetRepository();
  const profileJobRepo = profileJobRepository();
  const uploadJobRepo = uploadJobRepository();
  return {
    systemName: localConfig.systemName,
    logger,
    localConfigRepo: () => localConfigRepo,
    mediaRepo: () => mediaRepo,
    mediaProfileRepo: () => mediaProfileRepo,
    libraryRepo: () => libraryRepo,
    libraryScanRepo: () => libraryScanRepo,
    sourceScanRepo: () => sourceScanRepo,
    sourceRepo: () => sourceRepo,
    destinationRepo: () => destinationRepo,
    sourceAssetRepo: () => sourceAssetRepo,
    profileJobRepo: () => profileJobRepo,
    uploadJobRepo: () => uploadJobRepo,
    connectSource: async (name: string) => (await connectVolume(await sourceRepo.findById(name))).connection!,
    downloadDir: localConfig.downloadDir,
    assetDir: localConfig.assetDir,
    clock: DEFAULT_CLOCK,
    napAlarm: { wake: false },
    scanPollInterval: localConfig.scanPollInterval,
    analyzerPollInterval: localConfig.analyzerPollInterval,
    transformerPollInterval: localConfig.transformerPollInterval,
    uploaderPollInterval: localConfig.uploaderPollInterval,
    runScanner: localConfig.runScanner,
    runAnalyzer: localConfig.runAnalyzer,
    runTransformer: localConfig.runTransformer,
    runUploader: localConfig.runUploader,
    removeLocalFiles: localConfig.removeLocalFiles,
  };
};

export type SCANNER_TYPE = {
  instance: YbScanner | null;
};

export const SCANNER: SCANNER_TYPE = {
  instance: null,
};

export const initializeScanner = async (scanConfig: YbScanConfig): Promise<YbScanner> => {
  if (!SCANNER.instance) {
    SCANNER.instance = new YbScanner(scanConfig);
  }
  return SCANNER.instance;
};
