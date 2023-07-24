import md5 from "md5";

export const GRAVATAR_RATING_LEVEL = "r";
export const GRAVATAR_DEFAULT_IMAGE = "retro";

export const gravatarEmailHash = (email: string): string | null => (email ? md5(email.trim().toLowerCase()) : null);
export const gravatarEmailUrl = (email: string): string | null =>
  email
    ? `https://www.gravatar.com/avatar/${gravatarEmailHash(email)}?d=${encodeURIComponent(
        GRAVATAR_DEFAULT_IMAGE,
      )}&r=${GRAVATAR_RATING_LEVEL}`
    : null;

export const gravatarUrl = (user: Record<string, any>): string | null =>
  typeof user?.email === "string" && user.email.indexOf("@") !== -1 ? gravatarEmailUrl(user.email) : null;
