Yuebing Configuration
=====================

## Guiding principles
* Minimize config required to start
* Maximize config that can be set at runtime

## Environment
The [`env.example`](../env.example) file describes every available configuration option.

Copy this file to `.env` and edit it to match how you want to run Yuebing.

### Admin account
Define an initial admin account with the `YB_ADMIN_EMAIL` and `YB_ADMIN_PASSWORD` vars

### S3 storage
Define AWS/S3 settings to connect to storage with the various `YB_DEST_` vars

### Other vars in `.env`
Don't worry too much about getting all the other settings done. You'll be able to edit almost all of
these from within Yuebing's admin screen.

In the long run, only the `YB_DEST_` vars will continue to be required as environment variables when
starting Yuebing.

As most of the settings in this file can be changed at runtime, this environment file mostly matters
for the first time Yuebing runs.

## First-time Start
The first time Yuebing runs, it will:
 * Connect to the S3 bucket you have configured with env vars
 * Read the `publicConfig` and `privateConfig` objects from [nuxt.config.js](../nuxt.config.js)
 * Save the config objects to the S3 bucket, as `publicConfig.json` and `privateConfig.json`

On future runs, Yuebing will load its config from these files on S3 -- **NOT** from `nuxt.config.js`, and
**NOT** from environment variables (excepting the `YB_DEST_` options that tell Yuebing how to connect to
S3 and find these files)

## Editing the Configuration
Login as the admin user, and choose 'System Configuration'. When you save edits on this screen, the changes
will be written back to the config files on S3.

## Resetting the Configuration
Delete the `publicConfig.json` and `privateConfig.json` files from your S3 bucket, and they'll be re-created
the next time Yuebing runs, just as described in [Runtime configuration](#Runtime-configuration).

If you're using encrypted storage, you'll need to use the [mobiletto-cli](https://www.npmjs.com/package/mobiletto-cli)
to delete the config files.
