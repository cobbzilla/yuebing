export default defineEventHandler(async (event) => {
  return `${event.context.params.id} is the ID\n`;
});
