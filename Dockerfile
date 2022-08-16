FROM node:16.16.0-alpine3.16

RUN mkdir -p /usr/src/yuebing
WORKDIR /usr/src/yuebing

RUN apk update && apk upgrade && \
    apk add curl ffmpeg mediainfo

COPY . /usr/src/yuebing/

RUN yarn install && yarn build

EXPOSE 3000

CMD [ "./scripts/docker_start.sh" ]
