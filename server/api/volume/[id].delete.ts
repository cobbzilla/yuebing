import { MobilettoOrmSyncError } from "mobiletto-orm-typedef";

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const volumeRepo = volumeRepository();
  try {
    const volByName = await volumeRepo.safeFindFirstBy("name", id);
    if (volByName) {
      return await volumeRepo.remove(volByName);
    }
  } catch (e) {
    if (e instanceof MobilettoOrmSyncError) {
      logger.warn(`volume.delete: sync error: ${e}`);
      throw createError({ statusCode: 409, statusMessage: "conflict" });
    }
    logger.error(`volume.delete: unexpected error: ${e}`);
    throw createError({ statusCode: 500, statusMessage: "server error" });
  }
  throw createError({ statusCode: 404, statusMessage: "not found" });
});
