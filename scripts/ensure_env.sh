#!/bin/sh
ENV_TEMP=${1:?no env-temp file provided}
echo "export MOBILETTO_REDIS_HOST=${YB_REDIS_HOST:-127.0.0.1}" >> "${ENV_TEMP}"
echo "export MOBILETTO_REDIS_PORT=${YB_REDIS_PORT:-6379}" >> "${ENV_TEMP}"

SCRIPT="${0}"
die () {
  echo 1>&2 "${SCRIPT}: ${1}"
  exit 1
}

# adapted from https://unix.stackexchange.com/a/223000
read_password() {
  REPLY="$(
    # always read from the tty even when redirected:
    exec < /dev/tty || exit # || exit only needed for bash

    # save current tty settings:
    tty_settings=$(stty -g) || exit

    # schedule restore of the settings on exit of that subshell
    # or on receiving SIGINT or SIGTERM:
    trap 'stty "$tty_settings"' EXIT INT TERM

    # disable terminal local echo
    stty -echo || exit

    # read password as one line, record exit status
    IFS= read -r password; ret=$?

    # display a newline to visually acknowledge the entered password
    echo > /dev/tty

    # return the password for $REPLY
    printf '%s' "$password"
    exit "$ret"
  )"
  printf '%s' "${REPLY}"
}

SCRIPT_DIR="$(cd "$(dirname "${SCRIPT}")" && pwd)"
MSG="${SCRIPT_DIR}"/locale_string.sh

if [ -z "${YB_ADMIN_EMAIL}" ] ; then
  while [ -z "${YB_ADMIN_EMAIL}" ] ; do
    printf "%s" "$("${MSG}" shell_ensure_admin_email): "
    read -r YB_ADMIN_EMAIL
    if [ -n "${YB_ADMIN_EMAIL}" ] && [ "$(echo "${YB_ADMIN_EMAIL}" | egrep -c '(\w|\.)+@(\w+\.)+\w+')" -eq 0 ] ; then
      printf "%s" "$("${MSG}" shell_admin_email_invalid "YB_ADMIN_EMAIL=${YB_ADMIN_EMAIL}")
"
      YB_ADMIN_EMAIL=""
    fi
  done
fi

if [ -z "${YB_ADMIN_EMAIL}" ] ; then
  die "$("${MSG}" shell_admin_email_undefined)"
fi
echo "export YB_ADMIN_EMAIL=${YB_ADMIN_EMAIL}" >> "${ENV_TEMP}"

if [ -z "${YB_ADMIN_PASSWORD}" ] ; then
  while [ -z "${YB_ADMIN_PASSWORD}" ] ; do
    printf "%s" "$("${MSG}" shell_ensure_admin_password): "
    YB_ADMIN_PASSWORD="$(read_password)"
  done
fi
if [ -z "${YB_ADMIN_PASSWORD}" ] ; then
  die "$("${MSG}" shell_admin_password_undefined)"
fi
echo "export YB_ADMIN_PASSWORD=${YB_ADMIN_PASSWORD}" >> "${ENV_TEMP}"

if [ -z "${YB_DEST_TYPE}" ] ; then
  echo "export YB_DEST_TYPE=local" >> "${ENV_TEMP}"
  YB_DEFAULT_STORAGE="$(pwd)/yuebing_storage"
  YB_FALLBACK_STORAGE="/tmp/yuebing_storage"
  mkdir -p "${YB_DEFAULT_STORAGE}" || true

  if touch "${YB_DEFAULT_STORAGE}/.check_writable" ; then
    rm -f "${YB_DEFAULT_STORAGE}/.check_writable"
    echo "export YB_DEST_KEY=${YB_DEFAULT_STORAGE}" >> "${ENV_TEMP}"
    printf "%s" "$("${MSG}" shell_default_storage_used "YB_DEST_KEY=${YB_DEFAULT_STORAGE}")"

  elif touch "${YB_FALLBACK_STORAGE}/.check_writable" ; then
    rm -f "${YB_FALLBACK_STORAGE}/.check_writable"
    echo "export YB_DEST_KEY=${YB_FALLBACK_STORAGE}" >> "${ENV_TEMP}"
    printf "%s" "$("${MSG}" shell_default_storage_used "YB_DEST_KEY=${YB_FALLBACK_STORAGE}")"

  else
    die "$("${MSG}" shell_default_storage_error "YB_DEFAULT_DEST=${YB_DEFAULT_STORAGE}" "YB_FALLBACK_DEST=${YB_FALLBACK_STORAGE}")"
  fi
fi
