import * as fs from "fs";
import * as os from "os";
import { MobilettoConnection, mobiletto, registerDriver, MobilettoDriverParameter } from "mobiletto-base";
import { storageClient as localDriver } from "mobiletto-driver-local";
import { storageClient as s3Driver } from "mobiletto-driver-s3";
import { storageClient as b2Driver } from "mobiletto-driver-b2";
import { storageClient as genericDriver } from "mobiletto-driver-generic";
import {
  MobilettoOrmRepositoryFactory,
  MobilettoOrmStorageResolver,
  repositoryFactory,
  MobilettoOrmObject,
  MobilettoOrmTypeDef,
  MobilettoOrmRepository,
} from "mobiletto-orm";
import { DestinationType, DestinationTypeDef } from "yuebing-model";
import { connectVolume, VolumeConnectResult } from "yuebing-server-util";
import { YbScanConfig, YbScanner } from "yuebing-scan";
import { DEFAULT_STORAGE_NAME } from "~/utils/config";
import { logger } from "~/server/utils/logger";
import { Cached } from "~/server/utils/cached";
import { initializeScanner, loadScanConfig } from "~/server/utils/scan";
import { initializeMediaPlugins, mediaPluginsInitialized } from "~/server/utils/media";
import { mediaProfileRepository, mediaRepository } from "~/server/utils/repo/mediaRepo";
import { libraryRepository } from "~/server/utils/repo/libraryRepo";

const MOBILETTO_INIT = new Cached<boolean>(
  (): Promise<boolean> => {
    registerDriver("local", localDriver as MobilettoDriverParameter);
    registerDriver("s3", s3Driver as MobilettoDriverParameter);
    registerDriver("b2", b2Driver as MobilettoDriverParameter);
    registerDriver("generic", genericDriver as MobilettoDriverParameter);
    return Promise.resolve(true);
  },
  { name: "mobiletto_init" },
);

type YuebingConnection = {
  name: string;
  type: string;
  connection: MobilettoConnection;
  default?: boolean;
};

type SystemStoragesType = {
  storages: YuebingConnection[];
  defaultStorage: YuebingConnection | null;
  loadTime: number;
  refreshInterval: number;
};
const SYSTEM_STORAGE: SystemStoragesType = {
  storages: [],
  defaultStorage: null,
  loadTime: 0,
  refreshInterval: 60 * 60 * 1000, // every hour
};

const bootstrapDefaultStorage = async (): Promise<YuebingConnection> => {
  // Skip bootstrap if already done
  if (SYSTEM_STORAGE.defaultStorage) return SYSTEM_STORAGE.defaultStorage;

  // register mobiletto drivers
  await MOBILETTO_INIT.get();

  // create new storage on local filesystem
  const ybDir = os.homedir() + "/.yuebing_storage_local";
  const fstat = fs.statSync(ybDir, { throwIfNoEntry: false });
  if (!fstat) {
    fs.mkdirSync(ybDir);
  } else if (!fstat.isDirectory()) {
    throw new Error(
      `bootstrapDefaultStorage: default storage location already exists and is not a directory: ${ybDir}`,
    );
  }
  const conn = await mobiletto("local", ybDir);
  conn.name = DEFAULT_STORAGE_NAME;
  SYSTEM_STORAGE.defaultStorage = {
    name: DEFAULT_STORAGE_NAME,
    type: "local",
    connection: conn,
  };
  logger.info(`bootstrapDefaultStorage: initialized default storage: ${DEFAULT_STORAGE_NAME} dir=${ybDir}`);
  return SYSTEM_STORAGE.defaultStorage;
};

const currentConnections = (): MobilettoConnection[] => connectionsForStorages(currentStorages());

const connectionsForStorages = (ybConns: YuebingConnection[]): MobilettoConnection[] =>
  ybConns.map((s) => s.connection);

const currentStorages = (): YuebingConnection[] =>
  SYSTEM_STORAGE.defaultStorage ? [SYSTEM_STORAGE.defaultStorage, ...SYSTEM_STORAGE.storages] : SYSTEM_STORAGE.storages;

export const getStorages: MobilettoOrmStorageResolver = () => systemStorage();

const REPO_FACTORY: { factory: MobilettoOrmRepositoryFactory | null } = {
  factory: null,
};

const dynamicRepoFactory = (): MobilettoOrmRepositoryFactory => {
  if (!REPO_FACTORY.factory) {
    REPO_FACTORY.factory = repositoryFactory(getStorages, { prettyJson: !!process?.env?.YUEBING_PRETTY_JSON });
  }
  return REPO_FACTORY.factory;
};

const REPOS: Record<string, MobilettoOrmRepository<any>> = {};

export const ybRepo = <T extends MobilettoOrmObject>(typeDef: MobilettoOrmTypeDef) => {
  if (!REPOS[typeDef.typeName]) {
    REPOS[typeDef.typeName] = dynamicRepoFactory().repository<T>(typeDef);
  }
  return REPOS[typeDef.typeName];
};

export type ScanConfigWrapper = {
  scanConfig: null | YbScanConfig;
  awaken: () => unknown;
};

export const SCAN_CONFIG: ScanConfigWrapper = {
  scanConfig: null,
  awaken: () => {
    if (
      SCAN_CONFIG.scanConfig &&
      SCAN_CONFIG.scanConfig.napAlarm &&
      typeof SCAN_CONFIG.scanConfig.napAlarm.wake === "boolean"
    ) {
      logger.info("SCAN_CONFIG.awaken: setting napAlarm.wake = true");
      SCAN_CONFIG.scanConfig.napAlarm.wake = true;
    } else {
      logger.warn("SCAN_CONFIG.awaken: scanConfig.napAlarm not defined, cannot awaken");
    }
  },
};

export const initSubsystems = () => {
  if (!mediaPluginsInitialized()) {
    setTimeout(() => {
      loadScanConfig().then((scanConfig: YbScanConfig) => {
        SCAN_CONFIG.scanConfig = scanConfig;
        initializeMediaPlugins(mediaRepository(), mediaProfileRepository())
          .then(() =>
            initializeScanner(scanConfig).catch((e) => {
              logger.error(`initializeScanner failed: error=${e}`);
            }),
          )
          .catch((e2) => {
            logger.error(`initializeMediaPlugins failed: error=${e2}`);
          });
      });
    }, 1000);
  }
};

const systemStorage = async (): Promise<MobilettoConnection[]> => {
  if (!SYSTEM_STORAGE.defaultStorage) {
    await bootstrapDefaultStorage();
  }
  if (Date.now() - SYSTEM_STORAGE.loadTime > SYSTEM_STORAGE.refreshInterval) {
    // create a new volume repository with the current storages
    const storages = currentStorages();
    const factory = repositoryFactory(connectionsForStorages(storages));
    const repository = factory.repository<DestinationType>(DestinationTypeDef);

    // find all volumes
    const volumes: DestinationType[] = (await repository.safeFindBy("system", true)) as DestinationType[];
    logger.info(`systemStorage[refresh] connecting to ${volumes.length} volumes, again ok?`);

    // connect to all volumes
    const connectPromises: Promise<VolumeConnectResult>[] = volumes.map((v) => connectVolume(v));

    // filter results. log errors and collect connections
    const results: VolumeConnectResult[] = await Promise.all(connectPromises);
    const connections: YuebingConnection[] = results
      .map((r): YuebingConnection | null => {
        if (r.error) {
          logger.warn(`systemStorage[refresh] error connecting ${r.name} (type: ${r.type}) ${r.error}`);
        } else if (!r.connection) {
          logger.warn(
            `systemStorage[refresh] error connecting ${r.name} (type: ${r.type}): connection object not defined`,
          );
        } else {
          return {
            name: r.name,
            type: r.type,
            connection: r.connection,
          };
        }
        return null;
      })
      .filter((r: YuebingConnection | null) => !!r) as YuebingConnection[];

    if (connections.length === 0) {
      logger.error(
        `systemStorage[refresh] no connections! retaining current set of ${SYSTEM_STORAGE.storages.length} connections`,
      );
    } else {
      SYSTEM_STORAGE.storages.splice(0, SYSTEM_STORAGE.storages.length);
      SYSTEM_STORAGE.storages.push(...connections);
      initSubsystems();
    }
  }
  return currentConnections();
};
