export default defineEventHandler(async (event) => {
  const requestHeaders = event.req.headers;
  const headers: Record<string, string> = {};
  Object.keys(requestHeaders)
    .filter((k) => !k.toLowerCase().startsWith("x-"))
    .map((k) => (headers[k] = requestHeaders[k]));
  return headers;
});
