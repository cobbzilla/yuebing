import * as os from "os";
import { PrivateConfigType, PublicConfigType } from "yuebing-model";
import { FALLBACK_DEFAULT_LANG } from "yuebing-messages";
import { sha } from "mobiletto-orm-typedef";

export const DEFAULT_PUBLIC_CONFIG: PublicConfigType = {
  isDefault: true,
  public: process.env.YB_PUBLIC ? !!process.env.YB_PUBLIC : false,
  title: process.env.YB_TITLE ? process.env.YB_TITLE : "Yuebing 🥮",
  siteUrl: process.env.YB_SITE_URL ? process.env.YB_SITE_URL : "http://127.0.0.1:3000",
  registrationEnabled: process.env.YB_REGISTRATION_ENABLED ? !!process.env.YB_REGISTRATION_ENABLED : false,
  inviteFriendsEnabled: process.env.YB_INVITE_FRIENDS_ENABLED ? !!process.env.YB_REGISTRATION_ENABLED : false,
  limitRegistration: process.env.YB_LIMIT_REGISTRATION ? process.env.YB_LIMIT_REGISTRATION : "",
  defaultLocale: process.env.YB_DEFAULT_LOCALE ? process.env.YB_DEFAULT_LOCALE : FALLBACK_DEFAULT_LANG,
  emailEnabled: process.env.YB_EMAIL_ENABLED ? !!process.env.YB_EMAIL_ENABLED : false,
};

export const DEFAULT_PRIVATE_CONFIG: PrivateConfigType = {
  isDefault: true,
  auth: {
    verifyAccountTimeout: process.env.YB_AUTH_VERIFY_ACCOUNT_TIMEOUT
      ? parseInt(process.env.YB_AUTH_VERIFY_ACCOUNT_TIMEOUT)
      : 1000 * 60 * 60 * 24 * 2, // 2 days,
    resetPasswordTimeout: process.env.YB_AUTH_RESET_PASSWORD_TIMEOUT
      ? parseInt(process.env.YB_AUTH_RESET_PASSWORD_TIMEOUT)
      : 1000 * 60 * 60, // 1 hour
    sessionTimeout: process.env.YB_AUTH_SESSION_TIMEOUT
      ? parseInt(process.env.YB_AUTH_SESSION_TIMEOUT)
      : 1000 * 60 * 60 * 24 * 90, // 90 days
    bcryptTimeTarget: process.env.YB_AUTH_BCRYPT_TIME_TARGET
      ? parseInt(process.env.YB_AUTH_BCRYPT_TIME_TARGET)
      : 1000, // 1000 ms (1s), just in case this particular instance is very slow
  },
  emailEnabled: process.env.YB_EMAIL_ENABLED ? !!process.env.YB_EMAIL_ENABLED : false,
  email: {
    host: process.env.YB_EMAIL_HOST ? process.env.YB_EMAIL_HOST : "127.0.0.1",
    port: process.env.YB_EMAIL_PORT ? parseInt(process.env.YB_EMAIL_PORT) : 25,
    user: process.env.YB_EMAIL_USER ? process.env.YB_EMAIL_USER : "smtp_user",
    password: process.env.YB_EMAIL_PASSWORD ? process.env.YB_EMAIL_PASSWORD : "",
    secure: process.env.YB_EMAIL_SECURE ? !!process.env.YB_EMAIL_SECURE : false,
    fromEmail: process.env.YB_EMAIL_FROM_EMAIL ? process.env.YB_EMAIL_FROM_EMAIL : "nobody@localhost.example",
  },
};

const macs = () => sha(Object.values(os.networkInterfaces())
  .map(n => n.mac && !n.internal ? `${n.mac}` : "")
  .filter(m => m.length > 0)
  .join(":"));

export const systemName = () => `h~${os.hostname()}_p~${os.platform()}_a~${os.arch()}_m~${macs()}`;

export const DEFAULT_LOCAL_CONFIG: LocalConfigType = {
  isDefault: true,
  systemName: systemName(),
  autoscanEnabled: process.env.YB_AUTOSCAN_ENABLED ? !!process.env.YB_AUTOSCAN_ENABLED : false,
  autoscan: {
    initialDelay: process.env.YB_AUTOSCAN_INITIAL_DELAY
      ? parseInt(process.env.YB_AUTOSCAN_INITIAL_DELAY)
      : 1000 * 60 * 10, // 10 minutes
  },
}
