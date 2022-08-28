Yuebing Developer Documentation
===============================

# Setup
Yuebing requires [nodejs version 16 LTS](https://nodejs.org/en/download/), please ensure you have the correct version:

    node --version   // should echo something like "v16.17.0"

Once you've installed node, you'll also need yarn:

    sudo npm install -g yarn

Now that you've got node and yarn, you can install all the project dependencies:

    yarn install

# Environment variables
To run yuebing, it requires some "bootstrap" environment variables.

Copy the `env.example` to `.env` and edit it.

You will at least need to set the email/password for the admin user, and the S3 bucket configuration for
where configuration and assets will be stored. The rest can be configured from yuebing at runtime.

# Run Yuebing locally
## Production 
    yarn build  // builds everything and puts it in `dist`
    yarn start

## Development
    yarn dev

# Run Yuebing with Docker

## Production
    yarn docker-build
    yarn docker-run

## Development
The development docker image is lightweight and quick to build.

It mounts the yuebing directory inside the container, so we don't have to copy everything.

The dev container runs `yarn dev` instead of `yarn start`, so we're also able to skip the long `yarn build` step. 

    yarn docker-build-dev
    yarn docker-run-dev

### Resource limits
When running the docker dev container, you may run up against some resource limits. A common one that causes
problems is the "max filesystem watches" setting. Increase it using `sysctl`:

    sysctl -w fs.inotify.max_user_watches=500000
