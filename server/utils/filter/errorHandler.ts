import { MobilettoOrmNotFoundError, MobilettoOrmValidationError, ValidationErrors } from "mobiletto-orm";
import { MobilettoNotFoundError } from "mobiletto-base";
import { H3Error } from "h3";

export const validationError = (errors: ValidationErrors) =>
  createError({
    statusCode: 422,
    statusMessage: "validation error",
    data: JSON.stringify(errors),
  });

export const forbidden = () => {
  return createError({ statusCode: 403 });
};

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

export const filterErrors = async (event, logPrefix: string, fn: (event) => Promise<unknown>) => {
  try {
    return fn(event);
  } catch (e) {
    if (e instanceof H3Error) {
      throw e;
    } else if (e instanceof MobilettoOrmValidationError) {
      throw validationError(e.errors);
    } else if (e instanceof MobilettoOrmNotFoundError || e instanceof MobilettoNotFoundError) {
      throw notFound(e.id);
    } else {
      logger.error(`${logPrefix}: server error: ${JSON.stringify(e)}`);
      throw serverError();
    }
  }
};
