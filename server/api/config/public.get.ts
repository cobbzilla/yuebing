export default defineEventHandler((_event) => {
  return PUBLIC_CONFIG.get();
});
