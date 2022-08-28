#!/bin/sh
set -m
set -e

ulimit -f unlimited

echo 1>&2 " *** Starting redis ..."
redis-server &

./scripts/ensure_env.sh
. .env

if [ -n "${1}" ] && [ "${1}" = "dev" ] ; then
  echo 1>&2 " *** Starting nuxt (dev) ..."
  yarn dev
else
  echo 1>&2 " *** Starting nuxt (production) ..."
  yarn start
fi
