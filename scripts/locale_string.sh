#!/bin/sh
#
# Usage: locale_string.sh <message_name> [param1=arg1] [param2=arg2]
#
# Return a locale-specific string, if the language is supported.
# Otherwise return the value for 'en'
#
SCRIPT_DIR="$(cd "$(dirname "${0}")" && pwd)"
DEFAULT_LANG=en

MESSAGE_NAME="${1:?no message_name}"
PARAM1_NAME=""
PARAM1_VALUE=""
PARAM2_NAME=""
PARAM2_VALUE=""
if [ -n "$(printf "%s" "${2}" | grep '=')" ] ; then
  PARAM1_NAME="$(printf "%s" "${2}" | cut -d= -f1)"
  PARAM1_VALUE="$(printf "%s" "${2}" | cut -d= -f2-)"
fi
if [ -n "$(printf "%s" "${3}" | grep '=')" ] ; then
  PARAM2_NAME="$(printf "%s" "${3}" | cut -d= -f1)"
  PARAM2_VALUE="$(printf "%s" "${3}" | cut -d= -f2-)"
fi

die () {
  echo >&2 "${0}: ${1}"
  exit 1
}

message_value () {
  lang_file="${1}"
  message_name="${2}"
  cat "${lang_file}" | grep "${message_name}" | cut -d: -f2- | awk '{$1=$1};1' | sed -e "s/^'//" -e "s/',$//" -e "s/'$//" | sed -e 's/\\n/\n/g' | sed -e "s/\\\'/'/g"
}

sanitize_for_sed () {
  printf "%s" "${1}" | sed -e 's,/,\\/,g'
}

YB_LANG="$("${SCRIPT_DIR}"/detect_locale.sh "${DEFAULT_LANG}")"
LANG_FILE="${SCRIPT_DIR}"/../shared/messages/${YB_LANG}_messages.js
DEFAULT_LANG_FILE="${SCRIPT_DIR}"/../shared/messages/${DEFAULT_LANG}_messages.js

if [ -f "${LANG_FILE}" ] ; then
  VAL="$(message_value "${LANG_FILE}" "${MESSAGE_NAME}")"
elif [ -f "${DEFAULT_LANG_FILE}" ] ; then
  VAL="$(message_value "${DEFAULT_LANG_FILE}" "${MESSAGE_NAME}")"
else
  die "Neither language file ${LANG_FILE} nor default language file ${DEFAULT_LANG_FILE} was found"
fi

if [ -z "${VAL}" ] ; then
  printf "{???%s}" "${@}"

elif [ -n "${PARAM2_NAME}" ] ; then
  printf "%s" "${VAL}" | sed -E 's/\{\{[[:space:]]*'"${PARAM2_NAME}"'[[:space:]]*\}\}/'"$(sanitize_for_sed "${PARAM2_VALUE}")"'/g' | sed -E 's/\{\{[[:space:]]*'"${PARAM1_NAME}"'[[:space:]]*\}\}/'"$(sanitize_for_sed "${PARAM1_VALUE}")"'/g'

elif [ -n "${PARAM1_NAME}" ] ; then
  printf "%s" "${VAL}" | sed -E 's/\{\{[[:space:]]*'"${PARAM1_NAME}"'[[:space:]]*\}\}/'"$(sanitize_for_sed "${PARAM1_VALUE}")"'/g'

else
  printf "%s" "${VAL}"
fi
