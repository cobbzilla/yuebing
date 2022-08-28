#!/bin/sh
set -m
set -e

ulimit -f unlimited

echo 1>&2 " *** Starting redis, date=$(date)..."
redis-server &

sleep 2s # wait for redis logs to fly by

./scripts/ensure_env.sh
. .env

if [ -n "${1}" ] && [ "${1}" = "dev" ] ; then
  echo 1>&2 " *** Starting nuxt (dev) date=$(date) ..."
  yarn install && yarn dev
else
  echo 1>&2 " *** Starting nuxt (production) date=$(date) ..."
  yarn install && yarn start
fi
