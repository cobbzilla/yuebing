#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

die () {
  echo >&2 "${0}: ${1}"
  exit 1
}

VERSION="$(grep -m 1 version "${BASE_DIR}"/package.json | awk -F '"' '{print $4}')"

cd "${BASE_DIR}" \
  && docker build -t "cobbzilla/yuebing:${VERSION}" . \
  && docker tag "cobbzilla/yuebing:${VERSION}" cobbzilla/yuebing:latest \
  || die "Error building/tagging docker image"
