#!/bin/sh
#
# Usage: detect_locale.sh [default-lang]
#
# Inspects environment variables and prints the current ISO language code, if one can be found
#
DEFAULT_LANG="${1:-en}"

LANG_VALUE="${LANG}"
if [ -z "${LANG_VALUE}" ] ; then
  LANG_VALUE="${LANGUAGE}"
fi
if [ -z "${LANG_VALUE}" ] ; then
  LANG_VALUE="${LC_ALL}"
fi
if [ -z "${LANG_VALUE}" ] ; then
  LANG_VALUE="${LC_MESSAGES}"
fi
if [ -z "${LANG_VALUE}" ] ; then
  LANG_VALUE=${DEFAULT_LANG}
fi

echo "${LANG_VALUE}" | cut -d. -f1 | cut -d_ -f1
