export default defineEventHandler((_event) =>
  filterErrors(_event, "config.public.get", (_event) => PUBLIC_CONFIG.get()),
);
