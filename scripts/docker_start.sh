#!/bin/sh

set -m

if [ ${CERTBOT_ENABLED} ] ; then

fi

echo " *** Starting redis..."
redis-server &

echo " *** Starting nginx..."
nginx

echo " *** Starting nuxt..."
yarn start
