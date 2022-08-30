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
    apk add curl redis ffmpeg mediainfo

COPY . /usr/src/yuebing/

RUN yarn install && yarn build

EXPOSE 3000

CMD [ "./scripts/docker_start.sh" ]
