#!/bin/bash
#
# Launcher for production mode
#
# Sets up the bind-mount for the work-dir, pulls (or builds) the docker
# image if not found, and launches it
#
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMMAND="${1}"

DOCKER_REPO="cobbzilla/yuebing"
DOCKER_TAG="latest"
DOCKER_NAME="${DOCKER_REPO}:${DOCKER_TAG}"

function die () {
  echo 1>&2 "${0}: ${1}"
  exit 1
}

if [[ -z "$(docker image ls | grep "${DOCKER_REPO}" | grep "${DOCKER_TAG}")" ]] ; then
  cd "${BASE_DIR}" || die "Error trying to change directories to ${BASE_DIR}"
  if [[ -n "${YUEBING_DEV}" ]] ; then
    docker build -t "${DOCKER_REPO}":"${DOCKER_TAG}" . || die "Error building docker production image"
  else
    docker pull "${DOCKER_REPO}":"${DOCKER_TAG}" || die "Error pulling docker repo: ${DOCKER_REPO}:${DOCKER_TAG}"
  fi
fi

YB_WORK_DIR=$("${SCRIPT_DIR}"/ensure_work_dir.sh "${BASE_DIR}")
if [[ -z "${YB_WORK_DIR}" ]] ; then
  die "Error initializing YB_WORK_DIR"
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
