Yuebing 🥮
==========
Yuebing is open-source software for running video hosting sites.

Yuebing automatically prepares your source videos for streaming using modern formats, playable on any
device over any connection.

Yuebing can use either Amazon S3 or Backblaze B2 for backend storage, and has many advanced features.

### Source
* [yuebing on GitHub](https://github.com/cobbzilla/yuebing)
* [yuebing on npm](https://www.npmjs.com/package/yuebing)
* [yuebing on DockerHub](https://hub.docker.com/repository/docker/cobbzilla/yuebing)

# Read this in another language
This README.md document has been translated, via [hokeylization](https://github.com/cobbzilla/hokeylization), into
many languages.

I'm certain it's not perfect, but I hope it's better than nothing!

&nbsp;&nbsp;&nbsp;[🇸🇦 Arabic](docs/ar/README.md)
&nbsp;&nbsp;&nbsp;[🇧🇩 Bengali](docs/bn/README.md)
&nbsp;&nbsp;&nbsp;[🇩🇪 German](docs/de/README.md)
&nbsp;&nbsp;&nbsp;[🇺🇸 English](docs/en/README.md)
&nbsp;&nbsp;&nbsp;[🇪🇸 Spanish](docs/es/README.md)
&nbsp;&nbsp;&nbsp;[🇫🇷 French](docs/fr/README.md)
&nbsp;&nbsp;&nbsp;[🇹🇩 Hausa](docs/ha/README.md)
&nbsp;&nbsp;&nbsp;[🇮🇳 Hindi](docs/hi/README.md)
&nbsp;&nbsp;&nbsp;[🇮🇩 Indonesian](docs/id/README.md)
&nbsp;&nbsp;&nbsp;[🇮🇹 Italian](docs/it/README.md)
&nbsp;&nbsp;&nbsp;[🇯🇵 Japanese](docs/ja/README.md)
&nbsp;&nbsp;&nbsp;[🇰🇷 Korean](docs/ko/README.md)
&nbsp;&nbsp;&nbsp;[🇮🇳 Marathi](docs/mr/README.md)
&nbsp;&nbsp;&nbsp;[🇵🇱 Polish](docs/pl/README.md)
&nbsp;&nbsp;&nbsp;[🇧🇷 Portuguese](docs/pt/README.md)
&nbsp;&nbsp;&nbsp;[🇷🇺 Russian](docs/ru/README.md)
&nbsp;&nbsp;&nbsp;[🇰🇪 Swahili](docs/sw/README.md)
&nbsp;&nbsp;&nbsp;[🇵🇭 Tagalog](docs/tl/README.md)
&nbsp;&nbsp;&nbsp;[🇹🇷 Turkish](docs/tr/README.md)
&nbsp;&nbsp;&nbsp;[🇵🇰 Urdu](docs/ur/README.md)
&nbsp;&nbsp;&nbsp;[🇻🇳 Vietnamese](docs/vi/README.md)
&nbsp;&nbsp;&nbsp;[🇨🇳 Chinese](docs/zh/README.md)
----

# Contents
* [Inspiration](#Inspiration)
* [Features](#Features)
* [Installation](#Installation)
  * [Docker](#Docker)
  * [npm package](#npm-package)
  * [From source](#From-source)
* [Configuration](#Configuration)
  * [nginx config](#nginx-config)
* [Why the name yuebing?](#Why-the-name-yuebing?)

## Inspiration
Last year my mom spent a ton of time (and money!) to organize and digitize an archive of old family videos.
Some of these were quite old, going back to the 1940's. Really beautiful, classic stuff.

We wanted to privately share these with family, but *not with big tech*.
Going with "free" video hosting from a major provider was off the table.

What we were looking for:
* Self-hosted, but totally **hands-off easy** to run and maintain
* Streams in modern video formats, including adaptive bitrate
* Videos play on any device, desktop or mobile
* With a high-bandwidth connection, video quality is awesome; as good as it gets
  * **Even with a bad connection**, playback is decent quality and *doesn't skip or buffer*
* Encrypted storage, thus able to use public cloud storage solutions with some confidence
* Stateless server: persist anything important to storage that is highly resilient
  * **I don't want to worry about backups!**
  * *This was a nice to have. As it turns out nothing out there has anything like this. Yuebing does!*
* After running a beefy instance to transcode everything, tear it down and run something cheaper for the long-run
  * You can run Yuebing for under $10/month; and hopefully even less down the road as we optimize Yuebing's footprint

I took a couple of weeks to survey what was out there. I started to greatly relax my requirements, and still
could find nothing decent. I looked at several open source projects, I'm not saying which because they all had
multiple glaring flaws.

So, I decided, how hard could it be? You wire up S3 to ffmpeg, put a decently modern frontend on it, and you're done, right?
... well, uh, the bulk of the work took a couple of months, but it was too much fun to stop!
I hope you enjoy it too!

### <a style="text-decoration: none; color: inherit" href="https://open.spotify.com/track/0HEYFRBo4pBLLWjXsAZjod?si=riLTqMknTji7_X_4XzSkGQ&context=spotify%3Aalbum%3A20KGjm5xRROTqP0UY1EVRg">**Let's make self-hosting video sites super-easy!**</a>

## Features
* Transform an S3 (or B2) bucket of videos into a private video site for friends and family!
* Connect one or more source buckets providing raw media files
* Yuebing automatically transcodes source videos into the latest and most widely supported format for adaptive bitrate streaming (DASH/mp4)
* ALL data is stored in the destination bucket; you can destroy the server whenever you want
  * Useful for running initially on a CPU-optimized instance for the initial transcoding, then run \
    on a much cheaper instance for 24/7/365 service.
  * Supports fully encrypted storage (app-side encryption, only you have the key)
  * Always read-only from source, never change source content
  * Automatic and manual scanning for new media files
* How private or public do you want things? Yuebing supports:
  * Totally private: no media shown to anonymous users, only approved email addresses can create accounts
  * Semi-private: no media shown to anonymous users, but anyone can create a user account
  * Public with limited registration: media shown to everyone, but only approved email addresses can create accounts
  * Totally public: media shown to everyone, and anyone can create a user account
* Fully internationalized! All user-visible text (and other locale-specific stuff) comes from localized resources
  * [Help the community, translate Yuebing to new languages!](https://github.com/cobbzilla/yuebing/blob/master/docs/localize.md)
* Full-featured admin console
* Search videos by keywords, or from tag cloud
* <a href="https://www.patreon.com/cobbzilla">**Coming soon with your support**</a>:
  * Support for more media types (audio, images, etc)
  * User-uploaded media
  * Likes, shares, and push notifications
  * New "source type": Another Yuebing instance!
    * Federation between friendly instances: unified search, user accounts, etc

## Anonymous user feature (if the site has been configured to allow anonymous visitors)
* Browse media
* Watch media!
* Create account (if the site has been configured to allow account registration)

## Logged-in user features
* Browse media
* Watch media!
* Add a comment, edit your comment, delete your comment!
* Invite friends
* Edit account info
* Delete account, deletes everything that's yours including all your comments

## Admin user features
* Edit media metadata, view thumbnails, change selected thumbnail
* View media transform queue and job status
* Start new scans and indexes of source media

## Server/backend features
* Transient-friendly, ZERO persistent/important data is stored within the container.
  * All durable data is persisted in the destination bucket; essentially, we use S3 as our database
* Automatic periodic scanning of source bucket for new media
* Add and change media metadata; edits are stored on the destination bucket, source media is never modified
* Configurable output profiles. Default is DASH-mp4 with multiple sub-profiles
* User account info is also stored on the destination bucket, optionally encrypted
  * If encryption key is changed, admin can migrate users to the new key with web admin console

## Installation
You can install and run `yuebing` via docker, npm or directly from source.

### Docker
If you have docker, you can get started with Yuebing quickly:

    docker run -it cobbzilla/yuebing

### npm package
    # install globally with npm
    npm i -g yuebing

    # install globally with yarn
    yarn global add yuebing

    # Now the 'yuebing' command should be on your PATH
    yuebing

### From source
To run from source, you'll need nodejs v16+ and yarn

    # Clone source and install dependencies
    git clone https://github.com/cobbzilla/yuebing.git
    cd yuebing
    yarn install

    # Use the 'yuebing' command from the git repo
    ./yuebing

    # Or, since you have the source, run any of the `yarn` scripts
    yarn docker-run-dev    # Fastest build & startup, dev docker image
    yarn docker-run        # Faster at runtime, production docker image
    yarn dev               # Run yuebing locally in dev mode
    yarn build             # Build yuebing locally for production mode
    yarn start             # Start yuebing locally in production mode

See the [developer docs](https://github.com/cobbzilla/yuebing/blob/master/docs/developer.md) for more info

## Configuration
To play around with Yuebing, it's fine to start it without configuring anything.
Run `yuebing` and you'll be prompted to enter the minimal config when it starts.

If you plan on running Yuebing for a while, see the [configuration docs](https://github.com/cobbzilla/yuebing/blob/master/docs/config.md) for
more info on how to set things up.

### nginx config
Yuebing is a Nuxt app, and expects that you'll put nginx (or some other web server) in
front of it to handle SSL, rate limiting if needed, etc.

If you're using nginx, here is a [sample config](https://github.com/cobbzilla/yuebing/blob/master/docs/sample-yuebing-nginx.conf) you can use.

## Why the name yuebing?
[Oolong the rabbit](https://en.wikipedia.org/wiki/Oolong_(rabbit)) was an adorable and famous
[early internet meme](https://duckduckgo.com/?q=oolong+rabbit&ia=images&iax=images). Oolong died in 2003,
two years before a certain massively popular video service even existed!

Oolong's successor was named Yuebing. Yuebing wasn't nearly as famous as Oolong, but did that even matter?
Yuebing succeeded nonetheless.

Perhaps more interestingly, yuebing means [mooncake](https://en.wikipedia.org/wiki/Mooncake)
(Chinese: [月饼](https://zh.wikipedia.org/wiki/%E6%9C%88%E9%A5%BC),
Japanese: [月餅](https://ja.wikipedia.org/wiki/%E6%9C%88%E9%A4%85)); mooncakes are very tasty and can be found in
a wide variety of flavors and styles. Enjoy a time-honored regional style, or try an exotic cake from contemporary
bakers who are exploring deliciously uncharted territory! There is truly a yuebing for everyone!
