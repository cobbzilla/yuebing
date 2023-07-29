import { MobilettoOrmNotFoundError, MobilettoOrmValidationError, MobilettoOrmValidationErrors } from "mobiletto-orm";
import { H3Error, H3Event } from "h3";

export const validationError = (errors: MobilettoOrmValidationErrors) =>
  createError({
    statusCode: 422,
    statusMessage: "validation error",
    data: JSON.stringify(errors),
  });

export const forbidden = () => {
  return createError({ statusCode: 403 });
};

export const badRequest = () => createError({ statusCode: 400, statusMessage: "bad request" });

export const notFound = (id: string) =>
  createError({
    statusCode: 404,
    statusMessage: "not found",
    data: id,
  });

export const serverError = () =>
  createError({
    statusCode: 500,
    statusMessage: "server error",
  });

export const conflict = () => createError({ statusCode: 409, statusMessage: "conflict" });

export const filterErrors = async (event: H3Event, logPrefix: string, fn: (event: H3Event) => Promise<unknown>) => {
  try {
    return await fn(event);
  } catch (e) {
    if (e instanceof H3Error) {
      throw e;
    } else if (e instanceof MobilettoOrmValidationError) {
      throw validationError(e.errors);
    } else if (e instanceof MobilettoOrmNotFoundError) {
      throw notFound("id");
    } else {
      logger.error(`${logPrefix}: server error: ${JSON.stringify(e)}`);
      throw serverError();
    }
  }
};
