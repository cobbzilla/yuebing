import { createError } from "h3";
import { accountRepository } from "~/server/utils/repo/accountRepo";

const accountRepo = accountRepository();

const handleRead = async (event): Promise<string> => {
  return `READ HANDLER invoked with req.url=${event.req.url}\n`;
};

const handleCreate = async (event): Promise<string> => {
  const body = await readBody<string>(event, { strict: true });
  return `CREATE HANDLER invoked with body: ${JSON.stringify(body)}\n`;
};

const handleUpdate = async (event): Promise<string> => {
  return "UPDATE HANDLER invoked\n";
};

const handleDelete = async (event): Promise<string> => {
  return "DELETE HANDLER invoked\n";
};

const handlers: Record<string, (event) => Promise<string>> = {
  GET: handleRead,
  POST: handleCreate,
  PUT: handleUpdate,
  DELETE: handleDelete,
};

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  if (!(method in handlers)) {
    return createError({ statusCode: 403, statusMessage: "forbidden" });
  }
  const val = await handlers[method](event);
  console.log(`New request (returning ${val}) with method ${event.req.method}: ` + getRequestURL(event));
  return val;
});
