#!/bin/sh
set -m
set -e

ulimit -f unlimited

echo 1>&2 " *** Starting redis, date=$(date)..."
redis-server &

sleep 2s # wait for redis logs to fly by

# Ensure required env vars are set
ENV_TEMP="$(mktemp /tmp/env.XXXXXX)"
chmod 600 "${ENV_TEMP}"
./scripts/ensure_env.sh "${ENV_TEMP}" \
 && . "${ENV_TEMP}" \
 && rm -f "${ENV_TEMP}" || exit 1

if [ -n "${1}" ] && [ "${1}" = "dev" ] ; then
  echo 1>&2 " *** Starting nuxt (dev) date=$(date) ..."
  yarn dev
else
  echo 1>&2 " *** Starting nuxt (production) date=$(date) ..."
  yarn start
fi
