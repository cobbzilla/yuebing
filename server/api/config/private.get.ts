export default defineEventHandler(async (_event) =>
  filterErrors(_event, "config.private.get", async (_event) =>
    requireAdminAccountObject(_event, "config.private.get", (_event, _session, _account) => PRIVATE_CONFIG.get()),
  ),
);
