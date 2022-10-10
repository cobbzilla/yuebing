#!/bin/sh
set -m
set -e

SCRIPT="${0}"
die () {
  echo 1>&2 "${SCRIPT}: ${1}"
  exit 1
}

ulimit -f unlimited

if [ -n "${YB_WORK_SYS_REDIS}" ] && [ "${YB_WORK_SYS_REDIS}" = "true" ] ; then
  echo 1>&2 " *** Not starting docker redis"
else
  echo 1>&2 " *** Starting redis, date=$(date)..."
  redis-server &
  sleep 2s # wait for redis logs to fly by
fi

# Ensure required env vars are set
ENV_TEMP="$(mktemp /tmp/env.XXXXXX)"
chmod 600 "${ENV_TEMP}"
./scripts/ensure_env.sh "${ENV_TEMP}" \
 && . "${ENV_TEMP}" \
 && rm -f "${ENV_TEMP}" || die "Error ensuring env vars or sourcing/removing ENV_TEMP=${ENV_TEMP}"

if [ -n "${1}" ] && [ "${1}" = "dev" ] ; then
  echo 1>&2 " *** Starting nuxt (dev) date=$(date) ..."
  yarn dev
else
  echo 1>&2 " *** Starting nuxt (production) date=$(date) ..."
  yarn start
fi
