// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen
// @eslint-disable camelcase

export default defineEventHandler(async (event) => {
  filterErrors(event, "source.lookup", async (event) => {
    requireAdminAccountObject(event, "source.lookup", async (event, _session, _account) => {
      const id = event.context.params.id;
      const sourceRepo = sourceRepository();
      const source_by_id = await sourceRepo.safeFindById(id);
      if (source_by_id) return source_by_id;
      const source_by_name = await sourceRepo.safeFindFirstBy("name", id);
      if (source_by_name) return source_by_name;
      throw createError({ statusCode: 404, statusMessage: "not found" });
    });
  });
});
