Yuebing 🥮
==========
Yuebing is a private video hosting service. It uses Amazon S3 as the backend storage system.

### Source
* [yuebing on GitHub](https://github.com/cobbzilla/yuebing)
* [yuebing on npm](https://www.npmjs.com/package/yuebing)

## Fast Start
    ./yuebing

## Running from Source
To build/run from source, you'll need:
* node v16+
* yarn

Then run:

    yarn install
    yarn docker-run-dev    # Fastest build & startup, dev docker image
    yarn docker-run        # Faster at runtime, production docker image

See the [developer docs](./docs/developer.md) for more info

# Features
* Transform an S3 bucket with videos into a private video site for friends and family
* Give it a destination bucket to write to, point it at a source bucket, and let it run
* ALL data is stored in the destination bucket, so you can destroy the container and bring it up later
  * Useful for running initially on a CPU-optimized instance for the initial transformation, then run \
    on a much cheaper instance for 24/7/365 service.
* Automatic scanning
* Always read-only from source
* Source and dest can be in different AWS accounts
* Fully internationalized! All user-visible text (and other locale-specific stuff) comes from localized resources
* Multiple sources
* Full-featured admin console

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
[Oolong the rabbit](https://en.wikipedia.org/wiki/Oolong_(rabbit)) was an adorable and famous
[early internet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong died in 2003,
two years before a certain massively popular video service even existed.
Oolong's successor was named Yuebing. Yuebing wasn't nearly as famous as Oolong, but did that even matter?
Yuebing succeeded nonetheless.

Perhaps more interestingly, yuebing means [mooncake](https://en.wikipedia.org/wiki/Mooncake)
(Chinese: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
Japanese: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes are very tasty and can be found in
a wide variety of flavors and styles. Enjoy a time-honored regional style, or try an exotic cake from contemporary
bakers who are exploring deliciously uncharted territory! There is truly something for everyone!
