#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEV="${1}"

die () {
  echo >&2 "${0}: ${1}"
  exit 1
}

VERSION="$(grep -m 1 version "${BASE_DIR}"/package.json | awk -F '"' '{print $4}')"
if [ -z "${VERSION}" ] ; then
  die "No version found in ${BASE_DIR}/package.json"
fi

if [ -z "${DEV}" ] || [ "${DEV}" != "dev" ] ; then
  cd "${BASE_DIR}" \
    && docker build -t "cobbzilla/yuebing:${VERSION}" . \
    && docker tag "cobbzilla/yuebing:${VERSION}" cobbzilla/yuebing:latest \
    || die "Error building/tagging docker image"
else
  cd "${BASE_DIR}" \
    && docker build -t "cobbzilla/yuebing-dev:${VERSION}" . \
    && docker tag "cobbzilla/yuebing-dev:${VERSION}" cobbzilla/yuebing-dev:latest \
    || die "Error building/tagging DEV docker image"
fi
