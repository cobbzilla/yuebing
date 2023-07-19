export default defineEventHandler(async (event) => {
  return PUBLIC_CONFIG.get();
});
