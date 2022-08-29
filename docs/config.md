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

### Workbench directory
The `YB_WORK_DIR` env var is where Yuebing stores downloaded source files (which can be very large), and
all generated files when processing media, like transcoding artifacts (which can also be very large).

During heavy processing of new media files, the workbench directory can become **very large**.

The default workbench directory is `/tmp/yuebing_workdir` which is OK for playing around, but is insufficient for
processing large media libraries. The `/tmp` directory is often mounted on a small filesystem, or even
the root filesystem, and doesn't usually have a lot of space.

The `YB_WORK_DIR` setting cannot be changed after Yuebing has launched, and it is not
persisted in S3. It **must** be set in the `.env` file every time Yuebing starts.

**When you scan a large media source, mount a separate volume for `YB_WORK_DIR` that has plenty of space!**

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
**NOT** from environment variables.

**The only exceptions to this rule**: the `YB_DEST_` options that tell
Yuebing how to connect to S3 (and thus read these config files), and the `YB_WORK_DIR` env var, which must
always be supplied at launch-time.

## Editing the Configuration
Login as the admin user, and choose 'System Configuration'. When you save edits on this screen, the changes
will be written back to the config files on S3.

## Resetting the Configuration
Delete the `publicConfig.json` and `privateConfig.json` files from your S3 bucket, and they'll be re-created
the next time Yuebing runs, just as described in [Runtime configuration](#Runtime-configuration).

If you're using encrypted storage, you'll need to use the [mobiletto-cli](https://www.npmjs.com/package/mobiletto-cli)
to delete the config files.
