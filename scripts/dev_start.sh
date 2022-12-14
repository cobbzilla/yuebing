#!/bin/bash
#
# Launcher for dev mode
#
# Sets up the bind-mounts for yuebing source dir and the work-dir, builds
# the docker image if not found, and launches it
#
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

DOCKER_REPO="cobbzilla/yuebing-dev"
DOCKER_TAG="latest"
DOCKER_NAME="${DOCKER_REPO}:${DOCKER_TAG}"
COMMAND="${1}"

function die () {
  echo 1>&2 "${0}: ${1}"
  exit 1
}

if [[ -z "$(docker image ls | grep "${DOCKER_REPO}" | grep "${DOCKER_TAG}")" ]] ; then
  cd "${BASE_DIR}" || die "Error trying to change directories to ${BASE_DIR}"
  yarn docker-build-dev || die "Error building docker dev image"
fi

if [[ ! -d "${BASE_DIR}/node_modules" ]] ; then
  cd "${BASE_DIR}" || die "Error trying to change directories to ${BASE_DIR}"
  yarn install || die "Error installing node modules"
fi

YB_WORK_DIR=$("${SCRIPT_DIR}"/ensure_work_dir.sh "${BASE_DIR}")
if [[ -z "${YB_WORK_DIR}" ]] ; then
  die "Error initializing YB_WORK_DIR"
fi

SYS_REDIS_PORT=""
if [ $(cd "${BASE_DIR}" && grep -c YB_WORK_SYS_REDIS .env) -gt 0 ] && [ "$(. .env && echo -n "${YB_WORK_SYS_REDIS}")" = "true" ] ; then
  R_PORT=$(. .env && echo -n "${YB_REDIS_PORT:-6379}" | awk '{print $1}')
  SYS_REDIS_PORT="-p ${R_PORT}:${R_PORT}"
fi

SYS_REDIS_PORT=""
if [ -n "$(cd "${BASE_DIR}" && . .env && echo -n "${YB_WORK_SYS_REDIS_PORT}")" ] ; then
  SYS_REDIS_PORT="${YB_WORK_SYS_REDIS_PORT}"
fi

cd "${BASE_DIR}" && \
  docker run -it \
    --ulimit nofile=500000:500000 \
    --mount type=bind,source="${YB_WORK_DIR}",target=/usr/src/scratch \
    --env-file <(grep -v YB_WORK_DIR .env | sed -e 's/^export //' ; echo ; echo "YB_WORK_DIR=/usr/src/scratch" ; if [ -n "${SYS_REDIS_PORT}" ] ; then echo "YB_REDIS_PORT=${SYS_REDIS_PORT}" ; fi) \
    --env HOST=0.0.0.0 \
    --publish 127.0.0.1:3000:3000/tcp ${SYS_REDIS_PORT} \
    "${DOCKER_NAME}" ${COMMAND}
