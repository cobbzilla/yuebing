import { ValidationErrors } from "mobiletto-orm";
import { VolumeType } from "yuebing-model";

export default defineEventHandler(async (event) => {
  const name = event.context.params.id;
  const volumeRepo = volumeRepository();
  const obj: VolumeType = await readBody(event);
  if (!obj) {
    throw createError({ statusCode: 400, statusMessage: "bad request" });
  }
  if (obj.name !== name) {
    throw createError({ statusCode: 422, statusMessage: "validation error", data: { name: ["mismatch"] } });
  } else {
    return await volumeRepo.create(obj);
  }
});
