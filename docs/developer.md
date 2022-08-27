Yuebing Developer Documentation
-------------------------------

# Setup
Yuebing requires [nodejs version 16 LTS](https://nodejs.org/en/download/), please ensure you have the correct version:

    node --version   // should echo something like "v16.17.0"

Once you've installed node, you'll also need yarn:

    sudo npm install -g yarn

Now that you've got node and yarn, you can install all the project dependencies:

    yarn install

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
