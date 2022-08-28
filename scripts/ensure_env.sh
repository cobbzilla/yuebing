#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

show_notice () {
  echo "
=====================================================================
Welcome to Yuebing!
=====================================================================
GitHub: https://github.com/cobbzilla/yuebing
npm: https://www.npmjs.com/package/yuebing
=====================================================================
Looks like this is the first time you are launching Yuebing!

We'll need to write a few required environment variables to .env

If you want full control:
  Hit Control-C now, and read env.example
  Maybe take a look at docs/config.md and docs/developer.md too

If you want to get started fast:
  Answer the questions below to define a minimal configuration
  Other config settings can be changed at runtime via web admin
  "
}

die () {
  echo >&2 "${0}: ${1}"
  exit 1
}

ENV_FILE="${BASE_DIR}"/.env

REQUIRED="
YB_ADMIN_EMAIL
YB_ADMIN_PASSWORD
YB_DEST_BUCKET
YB_DEST_KEY
YB_DEST_SECRET
"

PASSWORDS="YB_ADMIN_PASSWORD YB_DEST_KEY YB_DEST_SECRET"

NOTICE_SHOWN=0
for req in ${REQUIRED} ; do
  if [ -z "$(grep "${req}" "${ENV_FILE}" | grep -v '#')" ] ; then
    if [ ${NOTICE_SHOWN} -eq 0 ] ; then
      show_notice
      NOTICE_SHOWN=1
    fi
    echo -n "
-------------------------------------------------------------------------------
*** Env var not defined: ${req}
-------------------------------------------------------------------------------
${req} : $(grep -B1 "${req}" "${BASE_DIR}"/env.example | head -1 | tr -d '#')
-------------------------------------------------------------------------------
Your value for ${req}: "
    ENV_VALUE=""
    while [ -z "${ENV_VALUE}" ] ; do
      if [ -z "$(echo "${PASSWORDS}" | grep "${req}")" ] ; then
        read -r ENV_VALUE
      else
        stty -echo
        read -r ENV_VALUE
        stty echo
      fi
    done
    echo "export ${req}=${ENV_VALUE}" >> "${ENV_FILE}" || die "Error writing ${req} env var to ${ENV_FILE}"
    chmod 0600 "${ENV_FILE}" || die "Error setting permissions (0600) on ${ENV_FILE}"
    continue
  else
    grep "${req}" "${ENV_FILE}" | grep -v '#'
  fi
done
