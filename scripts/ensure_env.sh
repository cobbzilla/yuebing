#!/bin/sh
ENV_TEMP=${1:?no env-temp file provided}
echo "export MOBILETTO_REDIS_HOST=${YB_REDIS_HOST:-127.0.0.1}" >> "${ENV_TEMP}"
echo "export MOBILETTO_REDIS_PORT=${YB_REDIS_PORT:-6379}" >> "${ENV_TEMP}"
