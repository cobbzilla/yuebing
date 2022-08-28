#!/bin/sh
LOG=/var/log/docker_start.log
echo "" > ${LOG}  # start log with a blank line, we dump it sometimes when errors occur

set -m
set -e

ulimit -f unlimited

echo 1>&2 " *** Starting redis ..."
redis-server &

if [ -n "${1}" ] && [ "${1}" = "dev" ] ; then
  echo 1>&2 " *** Starting nuxt (dev) ..."
  yarn dev
else
  echo 1>&2 " *** Starting nuxt (production) ..."
  yarn start
fi
