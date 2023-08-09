import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { SESSION_HEADER, sessionCookie } from "../auth";

export function authHeader() {
  const session = sessionCookie();
  if (session) {
    const headers: Record<string, string> = {};
    headers[SESSION_HEADER] = session.value;
    return headers;
  } else {
    return {};
  }
}

export function authHead(headers = null) {
  return authReq("HEAD", headers);
}
export function authGet(headers = null) {
  return authReq("GET", headers);
}
export function authDelete(headers = null) {
  return authReq("DELETE", headers);
}

export type OptionalHeaders = Record<string, string> | null;

export function authReq(method: string, headers: OptionalHeaders = null) {
  return {
    method,
    headers: headers ? Object.assign({}, headers, authHeader()) : authHeader(),
  };
}

export function authPostJson<T>(obj: T, headers: OptionalHeaders = null) {
  return authDataJson<T>(obj, "POST", headers);
}
export function authPutJson<T>(obj: T, headers: OptionalHeaders = null) {
  return authDataJson<T>(obj, "PUT", headers);
}
export function authPatchJson<T>(obj: T, headers: OptionalHeaders = null) {
  return authDataJson<T>(obj, "PATCH", headers);
}

export function authDataJson<T>(obj: T, method: string, headers: OptionalHeaders = null) {
  return {
    method,
    headers: headers
      ? Object.assign({}, headers, authHeader(), {
          "Content-Type": "application/json",
        })
      : authHeader(),
    body: JSON.stringify(obj),
  };
}

export function handleJsonResponse<T>(response: Response): Promise<T> {
  if (response && typeof response.text === "function") {
    return response.text().then((text) => {
      let data;
      try {
        data = typeof text === "string" ? JSON.parse(text) : null;
      } catch (e) {
        // console.log(`handleJsonResponse: error parsing: ${text}`);
        data = null;
      }
      if (!response.ok) {
        const error = data || text || response.statusText;
        return Promise.reject(error);
      }
      // console.log(`handleJsonResponse returning: ${JSON.stringify(data, null, 2)}`)
      return data;
    });
  } else {
    return Promise.resolve(response as T);
  }
}

export const handleErrors = (serverErrors?: Ref<MobilettoOrmValidationErrors>) => (e) => {
  if (!e.statusCode || !serverErrors) throw e;
  if (e.statusCode === 403) {
    serverErrors.value.global = ["forbidden"];
  } else if (e.statusCode === 404) {
    if (typeof e.data?.data === "string" && e.data.data.length > 0) {
      serverErrors.value[e.data.data] = ["notFound"];
    }
  } else if (e.statusCode === 422) {
    if (typeof e.data?.data === "string" && e.data.data.length > 0) {
      serverErrors.value = JSON.parse(e.data.data) as MobilettoOrmValidationErrors;
    }
  } else {
    throw e;
  }
};
