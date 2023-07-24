export default defineEventHandler((event) => {
  const requestHeaders = event.req.headers;
  const headers: Record<string, string | string[]> = {};
  Object.keys(requestHeaders)
    .filter((k: string) => !k.toLowerCase().startsWith("x-"))
    .map((k: string) => (headers[k] = requestHeaders[k] || ""));
  return headers;
});
