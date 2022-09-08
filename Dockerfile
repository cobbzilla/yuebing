FROM node:16.16.0-alpine3.16
#
# Yuebing Dockerfile
#
# GitHub: https://github.com/cobbzilla/yuebing
# npm: https://www.npmjs.com/package/yuebing
# DockerHub: https://hub.docker.com/repository/docker/cobbzilla/yuebing
#

RUN mkdir -p /usr/src/yuebing
RUN mkdir -p /usr/src/scratch

WORKDIR /usr/src/yuebing

RUN apk update && apk upgrade && \
    apk add --no-cache curl redis ffmpeg mediainfo

COPY . /usr/src/yuebing/

# Install dependencies required to build @ronomon/crypto-async
RUN apk add --no-cache make g++ python3 linux-headers libressl-dev musl-dev libffi-dev

RUN yarn install

# Remove build dependencies for @ronomon/crypto-async
RUN apk del make g++ python3 linux-headers libressl-dev musl-dev libffi-dev

RUN yarn build

EXPOSE 3000

CMD [ "./scripts/docker_start.sh" ]
