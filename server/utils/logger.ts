import { setLogLevel, setLogTransports } from "mobiletto-base";
import * as winston from "winston";

let LOGGER_INITIALIZED = false;

const initLogger = () => {
  if (LOGGER_INITIALIZED) return;
  LOGGER_INITIALIZED = true;
  if (process.env.YUEBING_LOG_LEVEL) {
    setLogLevel(process.env.YUEBING_LOG_LEVEL);
  }
  const transports = process.env.YUEBING_LOG_FILE
    ? [
        new winston.transports.File({
          filename: process.env.YUEBING_LOG_FILE,
        }),
      ]
    : [
        new winston.transports.Console({
          stderrLevels: Object.keys(winston.config.npm.levels),
        }),
      ];
  setLogTransports(transports);
};
initLogger();

export { logger } from "mobiletto-base";
