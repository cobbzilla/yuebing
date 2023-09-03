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
  console.log(`returning scan config.... localConfig=${JSON.stringify(localConfig, null, 2)}`);
  return {
    systemName: localConfig.systemName,
    logger,
    localConfigRepo: () => localConfigRepo,
    mediaRepo: () => mediaRepository(),
    mediaProfileRepo: () => mediaProfileRepository(),
    libraryRepo: () => libraryRepository(),
    libraryScanRepo: () => libraryScanRepository(),
    sourceScanRepo: () => sourceScanRepository(),
    sourceRepo: () => sourceRepo,
    destinationRepo: () => destinationRepository(),
    sourceAssetRepo: () => sourceAssetRepository(),
    profileJobRepo: () => profileJobRepository(),
    uploadJobRepo: () => uploadJobRepository(),
    connectSource: async (name: string) => (await connectVolume(await sourceRepo.findById(name))).connection!,
    downloadDir: localConfig.downloadDir,
    assetDir: localConfig.assetDir,
    clock: DEFAULT_CLOCK,
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

export const initializeScanner = async (): Promise<YbScanner> => {
  if (!SCANNER.instance) {
    SCANNER.instance = new YbScanner(await loadScanConfig());
  }
  return SCANNER.instance;
};
