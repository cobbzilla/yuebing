yuebing 🥮
==========

# Features

* Transform an S3 bucket with videos into a private YouTube-like site for friends and family
* Just point it at a source bucket, give it a destination bucket to write to, and let it run
* ALL data is stored in the destination bucket, so you can destroy the container and bring it up later
  * Useful for running initially on a CPU-optimized instance for the initial transformation, then run \
    on a much cheaper instance for 24/7/365 service.
* Automatic scanning
* Always read-only from source
* Source and dest can be in different AWS accounts

## Anonymous user feature (if the site has been configured to allow anonymous visitors)
  * Browse/search videos
  * Watch videos!
  * Create account (if the site has been configured to allow account registration)

## Logged-in user features
  * Browse/search videos
  * Watch videos!
  * Comment on videos
  * Like videos
  * Invite friends
  * Set language to English or French (please add more translations!)
  * Edit account info
  * Delete account

## Admin user features
  * Edit video metadata, view thumbnails, change selected thumbnail
  * View media transform queue and job status
  * Start new scans of source media

## Server/backend features
  * Transient-friendly, ZERO persistent/important data is stored within the container.
    * All durable data is persisted in the destination bucket; essentially, we use S3 as our database
  * Automatic periodic scanning of source bucket for new media
  * Add and change media metadata; edits are stored on the destination bucket, source media is never modified 
  * Configurable output profiles. Default is DASH-mp4 with four profiles, supporting quality levels from better-than-HD to super-low bandwidth
  * User account info is also stored on the destination bucket, optionally encrypted
    * If encryption key is changed, admin can migrate users to the new key with web admin console

### Why yuebing?
