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
import { logger } from "~/server/utils/logger";
import { Cached } from "~/server/utils/cached";

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
};

type SystemStoragesType = {
  storages: YuebingConnection[];
  loadTime: number;
  refreshInterval: number;
};
const SYSTEM_STORAGE: SystemStoragesType = {
  storages: [],
  loadTime: 0,
  refreshInterval: 60 * 60 * 1000, // every hour
};

const initializeStorage = async (): Promise<YuebingConnection> => {
  // register mobiletto drivers
  await MOBILETTO_INIT.get();

  // create new storage on local filesystem
  const ybDir = os.homedir() + "/.yuebing_storage_local";
  const fstat = fs.statSync(ybDir, { throwIfNoEntry: false });
  if (!fstat) {
    fs.mkdirSync(ybDir);
  } else if (!fstat.isDirectory()) {
    throw new Error(`initializeStorage: default storage location already exists and is not a directory: ${ybDir}`);
  }
  return {
    name: "~default~",
    type: "local",
    connection: await mobiletto("local", ybDir),
  };
};

const currentConnections = (): MobilettoConnection[] => SYSTEM_STORAGE.storages.map((s) => s.connection);

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

const systemStorage = async (): Promise<MobilettoConnection[]> => {
  if (SYSTEM_STORAGE.storages.length === 0) {
    logger.info(`systemStorage[refresh] initializing storage`);
    const initialStorage = await initializeStorage();
    if (SYSTEM_STORAGE.storages.length === 0) {
      SYSTEM_STORAGE.storages.push(initialStorage);
    }
    logger.info(`systemStorage[refresh] initialized storage: ${initialStorage.name}, type: ${initialStorage.type}`);
  }
  if (Date.now() - SYSTEM_STORAGE.loadTime > SYSTEM_STORAGE.refreshInterval) {
    // create a new volume repository with the current storages
    const factory = repositoryFactory(currentConnections());
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
    }
  }
  return currentConnections();
};
