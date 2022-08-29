#!/bin/bash

function die () {
  echo >&2 "${0}: ${1}"
  exit 1
}

BASE_DIR="${1:?no base dir provided}"

. "${BASE_DIR}"/.env

if [[ -z "${YB_WORK_DIR}" ]] ; then
  YB_WORK_DIR=/tmp/yuebing_workdir
elif [[ ${YB_WORK_DIR} == ${BASE_DIR}* ]] ; then
  die " *** ERROR: YB_WORK_DIR ${YB_WORK_DIR} must be outside of base directory ${BASE_DIR}"
fi

if [[ ! -d "${YB_WORK_DIR}" ]] ; then
  mkdir -p "${YB_WORK_DIR}" || die "Error creating YB_WORK_DIR=${YB_WORK_DIR}"
fi

echo -n "${YB_WORK_DIR}"
