const EMAIL_ENABLED : boolean = typeof process.env.YB_EMAIL_HOST === 'string' && process.env.YB_EMAIL_HOST.length > 0
const EMAIL_REQUIRED : string = EMAIL_ENABLED ? 'required|' : ''

const AUTOSCAN_INTERVAL_FIELD = {
  rules: 'integer|min_value:60000|max_value:3153600000000',
  when: 'enabled',
  format: 'duration',
  default: 1000 * 60 * 60 * 24 // default 24 hours
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  build: {
    transpile: ['vuetify'],
  },
  head: {
    title: process.env.YB_TITLE || 'Yuebing 🥮',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${process.env.YB_FAVICON_DIR || ''}/favicon.ico` },
      { rel: 'apple-touch-icon', sizes: '180x180', href: `${process.env.YB_FAVICON_DIR || ''}/apple-touch-icon.png` },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${process.env.YB_FAVICON_DIR || ''}/favicon-32x32.png` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${process.env.YB_FAVICON_DIR || ''}/favicon-16x16.png` },
      { rel: 'manifest', href: `${process.env.YB_FAVICON_DIR || ''}/site.webmanifest` },
      { rel: 'mask-icon', href: `${process.env.YB_FAVICON_DIR || ''}/safari-pinned-tab.svg`, color: '#5bbad5' }
    ]
  },
  runtimeConfig: {
    public: {
        title: process.env.YB_TITLE || 'Yuebing 🥮',

        // Links in outbound emails will point back here
        siteUrl: process.env.YB_SITE_URL || 'http://127.0.0.1:3000',

        // Set to true to allow anonymous browsing/viewing
        // WARNING: This can generate expensive bandwidth bills, depending on your site's traffic load
        public: process.env.YB_PUBLIC ? !!JSON.parse(process.env.YB_PUBLIC) : false,

        // Set to true to allow people to sign up
        allowRegistration: process.env.YB_ALLOW_REGISTRATION ? !!JSON.parse(process.env.YB_ALLOW_REGISTRATION) : false,

        // If limitRegistration is set, the allowRegistration setting is ignored
        // The limitRegistration property can be either:
        // 1. A string representing a path on the destination bucket to a file containing a list of email
        //    addresses to allow registration from. The contents of this file can be a JSON array, or a flat
        //    text file with one email address per line
        // 2. An array object, containing the email addresses to allow registration from
        limitRegistration: process.env.YB_LIMIT_REGISTRATION || null,

        // To add support for a new locale:
        //  - Add the locale name to the 'locales' array below
        //  - For UI/API strings: copy shared/messages/en.js to shared/messages/<locale>_messages.js and translate/adjust as needed
        //  - If email is enabled, copy the serverMiddleware/templates/email/en directory to a directory named after
        //    the new locale, then edit the files and translate/adjust as needed
        locales: [
          'ar', 'bn', 'de', 'en', 'es', 'fr', 'ha', 'hi', 'id', 'it', 'ja',
          'ko', 'mr', 'pl', 'pt', 'ru', 'sw', 'tl', 'tr', 'ur', 'vi', 'zh'
        ],
        defaultLocale: process.env.YB_DEFAULT_LOCALE || 'en',

        // timeouts for various temporary tokens stored in redis
        timeout: {
          verify: process.env.YB_TIMEOUT_ACCOUNT_VERIFICATION || 1000 * 60 * 60 * 24 * 2, // 2 days
          resetPassword: process.env.YB_TIMEOUT_RESET_PASSWORD || 1000 * 60 * 60, // 1 hour

          // the various 'configurable' sections provide metadata (validation rules/etc) for
          // the admin "manage config" screen
          configurable: {
            verify: {
              rules: 'required|integer|min_value:0|max_value:3153600000000',
              format: 'duration',
              default: 1000 * 60 * 60 * 24 * 2 // 2 days
            },
            resetPassword: {
              rules: 'required|integer|min_value:0|max_value:3153600000000',
              format: 'duration',
              default: 1000 * 60 * 60 // 1 hour
            }
          }
        },

        // Allow the frontend to use DurationField to render these
        autoscanIntervalField: AUTOSCAN_INTERVAL_FIELD,

        // When enabled, logged-in users will see an "invite friends" feature in page footer
        inviteFriendsEnabled: process.env.YB_INVITE_FRIENDS_ENABLED || true,

        // Don't change this line. If you want to enable/disable email, set the YB_EMAIL_HOST environment
        // variable (and others, see below in privateRuntimeConfig for email settings)
        emailEnabled: EMAIL_ENABLED,

        // the various 'configurable' sections provide metadata (validation rules/etc) for the "System
        // Configuration" page in the admin panel, which allows most settings to be updated at runtime
        configurable: {
          title: {
            rules: 'required|min:2|max:500'
          },
          siteUrl: {
            rules: 'required|url|min:2|max:1024'
          },
          public: {
            rules: 'required',
            format: 'flag',
            default: false
          },
          allowRegistration: {
            rules: 'required',
            format: 'flag',
            default: false
          },
          limitRegistration: {
            rules: 'max:1024',
            default: null
          },
          defaultLocale: {
            rules: 'locale|min:2|max:5'
          },
          inviteFriendsEnabled: {
            rules: 'required',
            format: 'flag',
            default: true
          },
          emailEnabled: {
            rules: 'required',
            format: 'flag',
            default: EMAIL_ENABLED
          }
        }
      },
    private: {
      // Initial admin user, will be created if it does not exist
      admin: {
        user: {
          email: process.env.YB_ADMIN_EMAIL || null,
          username: process.env.YB_ADMIN_USERNAME || 'admin',
          password: process.env.YB_ADMIN_PASSWORD || null,
          locale: process.env.YB_ADMIN_LOCALE || process.env.YB_DEFAULT_LOCALE || 'en'
        },
        overwrite: !!process.env.YB_ADMIN_OVERWRITE // set to true to overwrite existing admin user
      },

      // SMTP settings for sending email
      // If host is not set, emails will be disabled
      // Do not set edit the lines below.
      // Instead, set the YB_EMAIL environment variables to the config you want
      email: {
        host: process.env.YB_EMAIL_HOST || null,
        port: process.env.YB_EMAIL_PORT || 587,
        user: process.env.YB_EMAIL_USER || null,
        password: process.env.YB_EMAIL_PASSWORD || null,
        secure: process.env.YB_EMAIL_SECURE || true,
        fromEmail: process.env.YB_EMAIL_FROM || 'nobody@localhost.localhost',
        configurable: {
          host: {
            rules: `${EMAIL_REQUIRED}host|min:6|max:128`
          },
          port: {
            rules: `${EMAIL_REQUIRED}integer|min_value:10|max_value:65000`
          },
          user: {
            rules: `${EMAIL_REQUIRED}min:2|max:100`
          },
          password: {
            rules: `${EMAIL_REQUIRED}min:2|max:100`
          },
          secure: {
            rules: EMAIL_REQUIRED,
            format: 'flag'
          },
          fromEmail: {
            rules: `${EMAIL_REQUIRED}email|min:2|max:100`
          }
        }
      },

      // redis is used for: server-side caching, the xform job queue, and web sessions
      redis: {
        host: process.env.YB_REDIS_HOST || '127.0.0.1',
        port: process.env.YB_REDIS_PORT || 6379,

        // Set to true to flush redis when the yuebing starts (this will log out all users)
        // when false, any transform jobs abandoned from a previous run may cause show (benign) errors
        // in your logs. Start another scan to reprocess the abandoned jobs.
        flushAtStartup: (typeof process.env.YB_REDIS_FLUSH_AT_STARTUP !== 'undefined') ? !!JSON.parse(process.env.YB_REDIS_FLUSH_AT_STARTUP) : true,

        // Set to true to build the search index when yuebing starts
        // This could take a long time if you have a lot of media to index
        // You can rebuild the index on-demand using the web admin
        buildSearchIndexAtStartup: (typeof process.env.YB_BUILD_SEARCH_INDEX_AT_STARTUP !== 'undefined') ? !!JSON.parse(process.env.YB_BUILD_SEARCH_INDEX_AT_STARTUP) : false,

        // Cache duration for manifests, in milliseconds
        // Note that manifests will only be recalculated if the Last-Modified header of the `lastModified`
        // file is newer than the cache's ctime
        manifestCacheExpiration: process.env.YB_MANIFEST_CACHE_EXPIRATION || 60 * 1000, // default 1 minute

        configurable: {
          host: {
            // eslint-disable-next-line no-useless-escape
            rules: 'required|host|min:6|max:128'
          },
          port: {
            rules: 'required|integer|min_value:10|max_value:65000'
          },
          flushAtStartup: {
            rules: 'required',
            format: 'flag',
            default: true
          },
          listingCacheExpiration: {
            rules: 'required|integer|min_value:0|max_value:3153600000000',
            format: 'duration',
            default: 5 * 60 * 1000 // default 5 minutes
          },
          manifestCacheExpiration: {
            rules: 'required|integer|min_value:0|max_value:3153600000000',
            format: 'duration',
            default: 60 * 1000 // default 1 minute
          }
        }
      },

      // A map of supported (media type) -> (config for the media type)
      //
      // The existence of a mediaType named 'foo' implies that there exists:
      //  * A specification in 'shared/media/foo.js' to determine which files match and what to do with them
      //  * A page in 'pages/media/foo.vue' to display an individual media item with type foo
      //  * A driver in 'serverMiddleware/asset/driver/foo.js' that generates assets from a source of type foo
      //    - The driver must export a functions named after each operation that the driver supports
      //      See serverMiddleware/asset/driver/video.js for an example.
      //
      media: {
        video: {
          // 'allowedCommands' is a list of programs the driver is allowed to run.
          //
          // The first command listed is the default command and will be used for any profiles that
          // do not specify a 'command' property.
          //
          // Anything that looks like a shell will fail validation (bash/zsh/ssh/etc)
          allowedCommands: ['./scripts/ffmpeg_wrapper', './scripts/mediainfo_wrapper']
        }
      },

      encryption: {
        // Optional. Define these to encrypt data stored in destination bucket
        //
        // WARNING: if you change this, your data-storage location will be different, so
        // existing users will no longer be able to sign in and nothing will really work.
        // Login as admin and visit the /admin page to migrate to the new encryption key.
        // You will need the old key/IV/algo combination to read the old data.
        // Key rotation is expensive. We must read, decrypt, re-encrypt and re-write *everything* that is encrypted.
        // It may take a long time. Also consider bandwidth costs between wherever this Nuxt server is running
        // and wherever the storage is located.
        key: process.env.YB_DATA_ENCRYPTION_KEY,
        iv: process.env.YB_DATA_ENCRYPTION_IV, // IV is optional; if empty it is derived from key
        algo: process.env.YB_DATA_ENCRYPTION_ALGO, // algo is optional; default is 'aes-256-cbc'

        // Passwords are stored as bcrypt hashes. How many rounds to use
        bcryptRounds: process.env.YB_BCRYPT_ROUNDS || 12,

        configurable: {
          key: {
            rules: 'max:1024'
          },
          iv: {
            rules: 'max:1024'
          },
          algo: {
            rules: 'max:50'
          },
          bcryptRounds: {
            rules: 'required|integer|min_value:8|max_value:100'
          }
        }
      },

      session: {
        // How long web sessions last
        expiration: process.env.YB_SESSION_EXPIRATION || 1000 * 60 * 60 * 24, // default 24 hours

        configurable: {
          expiration: {
            rules: 'required|integer|min_value:0|max_value:3153600000000',
            format: 'duration',
            default: 1000 * 60 * 60 * 24
          }
        }
      },

      // Some autoscan settings can be overridden at the library-level:
      //  * enabled (autoscan can be turned on or off for a library)
      //  * interval (how often to scan)
      autoscan: {
        // When autoscan is disabled, you can still start a scan from the web admin console
        enabled: process.env.YB_AUTOSCAN_ENABLED || false,

        // How frequently to scan sources for autoscan configurations
        // If you change the autoscan configuration for a source, the most recent scan time
        // for that source will be cleared, and the next time the autoscanner runs, it will
        // rescan the source.
        // Minimum interval is 1 hour. Lower settings are ignored.
        // Only one scan runs at a time. If an active scan is already running when a new
        // interval is triggered, the next scan will be queued.
        interval: process.env.YB_AUTOSCAN_INTERVAL || 1000 * 60 * 60 * 24, // default 24 hours

        // How long to wait before the initial startup scan
        // Minimum interval is 5 seconds. Lower settings are ignored.
        initialDelay: process.env.YB_AUTOSCAN_INITIAL_DELAY || 1000 * 60 * 2, // default 2 minutes

        // Show stdout/stderr from transform commands? It is a LOT of output (ffmpeg for example)
        showTransformOutput: false,

        // Delete temp files after transforming media.
        // It can be useful to disable this when debugging problematic media transforms
        cleanupTemporaryAssets: true,

        // Delete incomplete uploads
        // It can be useful to disable this when debugging problematic storage
        deleteIncompleteUploads: true,

        // How many concurrent transformations can be done
        concurrency: process.env.YB_AUTOSCAN_XFORM_CONCURRENCY || 2,

        configurable: {
          enabled: {
            rules: 'required',
            format: 'flag',
            default: true
          },
          interval: AUTOSCAN_INTERVAL_FIELD,
          initialDelay: {
            rules: 'integer|min_value:60000|max_value:3153600000000',
            when: 'enabled',
            format: 'duration',
            default: 1000 * 30 // default 30 seconds
          },
          showTransformOutput: {
            rules: 'required',
            format: 'flag',
            default: false
          },
          cleanupTemporaryAssets: {
            rules: 'required',
            format: 'flag',
            default: true
          },
          deleteIncompleteUploads: {
            rules: 'required',
            format: 'flag',
            default: true
          },
          concurrency: {
            rules: 'required|integer|min_value:1|max_value:10000',
            default: 2
          }
        }
      }
    }
  }
})