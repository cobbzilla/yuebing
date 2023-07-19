export default defineEventHandler(async (event) => {
  // todo: verify user session is admin
  // todo: consider moving this API to /admin
  return PRIVATE_CONFIG.get();
});
