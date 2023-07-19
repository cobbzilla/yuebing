 export default defineEventHandler(async (event) => {
  return `wtf man: ${event.context.params.id} is the ID\n`;
});
