//
// Files in this directory are the only code shared between both client and server.
// As such, code here should remain very simple. Constants. Stateless methods. Nothing too fancy.
//

import { AuthAccountType, VolumeType } from "yuebing-model";
import { sessionParams, UserStatus } from "~/utils/auth";

// adapted from https://stackoverflow.com/a/1203361
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getExtension(filename: string) {
  return filename.split(".").pop();
}

export const QUALITY_PARAM = "q";

export const INDEX_STILL_BUILDING_TOKEN = "~~";

export const STREAM_API = "/api/source/stream";

export function proxyMediaUrl(asset: string, user: AuthAccountType, status: UserStatus) {
  const sessionParam = sessionParams(user, status);
  return `${STREAM_API}/${asset}${sessionParam}`;
}

export function addQualityParam(url: string, quality: string | null) {
  return url + (quality === null ? "" : (url.includes("?") ? "&" : "?") + `${QUALITY_PARAM}=${quality}`);
}

export function normalizeUrl(base: string, path: string) {
  return (base.endsWith("/") ? base : base + "/") + (path.startsWith("/") ? path.substring(1) : path);
}

export const HTTP_INVALID_REQUEST_MESSAGE = "http_invalid_request_method";

export const okl = (obj: object) => (typeof obj === "object" ? Object.keys(obj).length : 0);

export const empty = (thing: any) =>
  typeof thing === "undefined" ||
  thing === null ||
  (thing.length && thing.length === 0) ||
  (typeof thing === "object" && okl(thing) === 0);

export const chopFileExt = (s: string) => {
  const dot = s.indexOf(".");
  return dot === -1 || dot === s.length ? s : s.substring(0, dot);
};

export const isAllDigits = (s: string) => /^\d+$/.test(s);
export const isAllDigitsOrNonWordChars = (s: string) => /^[\d\W]+$/.test(s);

export const SEARCH_REGEX = /[^\s"]+|"([^"]*)"/gi;

// adapted from https://stackoverflow.com/a/18647776/1251543
export const splitSearchTerms = (terms: string) => {
  const found = [];
  let match;
  do {
    // Each call to exec returns the next regex match as an array
    match = SEARCH_REGEX.exec(terms);
    if (match != null) {
      // Index 1 in the array is the captured group if it exists
      // Index 0 is the matched text, which we use if no captured group exists
      found.push(match[1] ? match[1] : match[0]);
    }
  } while (match != null);
  return found;
};

export const LAST_MODIFIED_FILE = "lastModified";
export const SELECTED_THUMBNAIL_FILE = "selectedThumbnail.json";
export const ERROR_FILE_PREFIX = "_error_";

export const MULTIFILE_PLACEHOLDER = "%03d";
export const MULTIFILE_FIRST = "001";

// export const publicConfigField = (vue, field) => {
//   return vue && vue.publicConfig && vue.publicConfig[field]
//     ? vue.publicConfig[field]
//     : undefined;
// };

// adapted from https://stackoverflow.com/a/23593099/1251543
export const isoDate = (millis: number) => {
  const d = new Date(millis);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) {
    month = "0" + month;
  }
  if (day.length < 2) {
    day = "0" + day;
  }
  return [year, month, day].join("-");
};

export const isoTime = (millis: number, showSeconds = false) => {
  const d = new Date(millis);
  let hour = "" + d.getHours();
  if (hour.length < 2) {
    hour = "0" + hour;
  }
  let minute = "" + d.getMinutes();
  if (minute.length < 2) {
    minute = "0" + minute;
  }
  if (!showSeconds) {
    return [hour, minute].join(":");
  }
  let second = "" + d.getSeconds();
  if (second.length < 2) {
    second = "0" + second;
  }
  return [hour, minute, second].join(":");
};

export const UI_CONFIG = {
  snackbarErrorTimeout: 6000,
  snackbarSuccessTimeout: 6000,
};

export const DEFAULT_VOLUME_PREFIX = "~ default ~";
export const DEFAULT_TEMP_VOLUME = DEFAULT_VOLUME_PREFIX + ":tmpdir";

export const isDefaultVolume = (volume: string | VolumeType) =>
  volume &&
  ((typeof volume === "string" && volume.startsWith(DEFAULT_VOLUME_PREFIX)) ||
    (typeof volume === "object" && volume.name && volume.name.startsWith(DEFAULT_VOLUME_PREFIX)));

export const deepUpdate = (obj: any, fieldPath: string, value: any) => {
  let thing = obj;
  const parts = fieldPath.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof thing[parts[i]] === "undefined") {
      thing[parts[i]] = {};
    }
    thing = thing[parts[i]];
  }
  thing[parts[parts.length - 1]] = value;
};

export const deepGet = (obj: any, fieldPath: string) => {
  let thing = obj;
  const parts = fieldPath.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof thing[parts[i]] === "undefined") {
      thing[parts[i]] = {};
    }
    thing = thing[parts[i]];
  }
  return thing[parts[parts.length - 1]];
}

export type ClockType = { now: () => number };

export const DEFAULT_CLOCK: ClockType = {
  now: () => Date.now(),
};
