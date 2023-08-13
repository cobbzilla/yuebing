import { logger } from "mobiletto-base";

logger.setLogLevel(process?.env?.YUEBING_LOG_LEVEL || "error");

export { logger } from "mobiletto-base";
