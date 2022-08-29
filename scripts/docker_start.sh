#!/bin/sh
set -m
set -e

ulimit -f unlimited

echo 1>&2 " *** Starting redis, date=$(date)..."
redis-server &

sleep 2s # wait for redis logs to fly by

# Ensure required env vars are set
./scripts/ensure_env.sh

# Ensure YB_WORK_DIR is always /usr/src/scratch in docker container
( grep -v YB_WORK_DIR .env | sed -e 's/^export //' ; echo "YB_WORK_DIR=/usr/src/scratch" ) > .env-docker
. .env-docker

if [ -n "${1}" ] && [ "${1}" = "dev" ] ; then
  echo 1>&2 " *** Starting nuxt (dev) date=$(date) ..."
  yarn dev
else
  echo 1>&2 " *** Starting nuxt (production) date=$(date) ..."
  yarn start
fi
