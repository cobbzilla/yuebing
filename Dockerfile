FROM node:16.16.0-alpine3.16

RUN mkdir -p /usr/src/s3vid
WORKDIR /usr/src/s3vid

RUN apk update && apk upgrade && apk add redis curl ffmpeg mediainfo

COPY . /usr/src/s3vid/

RUN yarn install && yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
