import { PrivateConfigType, PublicConfigType } from "yuebing-model";
import { FALLBACK_DEFAULT_LANG } from "yuebing-messages";

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
  autoscanEnabled: process.env.YB_AUTOSCAN_ENABLED ? !!process.env.YB_AUTOSCAN_ENABLED : false,
  autoscan: {
    initialDelay: process.env.YB_AUTOSCAN_INITIAL_DELAY
      ? parseInt(process.env.YB_AUTOSCAN_INITIAL_DELAY)
      : 1000 * 60 * 10, // 10 minutes,
    interval: process.env.YB_AUTOSCAN_INTERVAL ? parseInt(process.env.YB_AUTOSCAN_INTERVAL) : 1000 * 60 * 60 * 24, // default 24 hours
    showTransformOutput: process.env.YB_AUTOSCAN_SHOW_TRANSFORM_OUTPUT
      ? !!process.env.YB_AUTOSCAN_SHOW_TRANSFORM_OUTPUT
      : false,
    cleanupTemporaryAssets: process.env.YB_AUTOSCAN_CLEANUP_TEMPORARY_ASSETS
      ? !!process.env.YB_AUTOSCAN_CLEANUP_TEMPORARY_ASSETS
      : true,
    deleteIncompleteUploads: process.env.YB_AUTOSCAN_DELETE_INCOMPLETE_UPLOADS
      ? !!process.env.YB_AUTOSCAN_DELETE_INCOMPLETE_UPLOADS
      : true,
    transformConcurrency: process.env.YB_AUTOSCAN_TRANSFORM_CONCURRENCY
      ? parseInt(process.env.YB_AUTOSCAN_TRANSFORM_CONCURRENCY)
      : 1,
  },
};
