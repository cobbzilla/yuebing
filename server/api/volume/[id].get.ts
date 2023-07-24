const volumeRepo = volumeRepository();

export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const volById = await volumeRepo.safeFindById(id);
  if (volById) return volById;
  const volByName = await volumeRepo.safeFindFirstBy("name", id);
  if (volByName) return volByName;
  throw createError({ statusCode: 404, statusMessage: "not found" });
});
