#!/bin/sh
LOG=/var/log/docker_start.log
echo "" > ${LOG}  # start log with a blank line, we dump it sometimes when errors occur

set -m

echo 1>&2 " *** Starting redis..."
redis-server &

echo 1>&2 " *** Starting nuxt..."
yarn start
