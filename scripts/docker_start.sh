#!/bin/sh
LOG=/var/log/docker_start.log
echo "" > ${LOG}  # start log with a blank line, we dump it sometimes when errors occur

set -m

#if [ -z "${SKIP_STRONG_DH_PARAMS}" ] ; then
#  # see https://weakdh.org/sysadmin.html
#  DH_PARAMS=/etc/nginx/dhparams.pem
#  echo " *** Generating strong dhparams..." > ${LOG}
#  /usr/bin/openssl dhparam -out ${DH_PARAMS} 2048 2>&1 | tee -a ${LOG} || OK=0
#  if [ ${OK} -ne 1 ] ; then
#    echo 1>&2 " *** Error generating strong dhparams: $(cat ${LOG})"
#    exit 1
#  fi
#fi
#
#OK=1
#YB_SITE_URL="${YB_SITE_URL:?No YB_SITE_URL env var defined}"
#SERVER_HOSTNAME="${YB_HOSTNAME:-$(echo "${YB_SITE_URL}" | tr ':/' '  ' | awk '{print $2}')}"
#if [ -n "${YB_CERTBOT_ENABLED}" && "${YB_CERTBOT_ENABLED}" = "true" ] ; then
#  YB_CERTBOT_EMAIL=${YB_CERTBOT_EMAIL:?YB_CERTBOT_ENABLED is true but YB_CERTBOT_EMAIL is not defined}
#  echo "Calling certbot register with email address: ${YB_CERTBOT_EMAIL}"
#  certbot register --agree-tos -m "${YB_CERTBOT_EMAIL}" --non-interactive 2>&1 | tee -a ${LOG} || OK=0
#  if [ ${OK} -ne 1 ] ; then
#    echo 1>&2 " *** Error registering Certbot account: $(cat ${LOG})"
#    exit 1
#  fi
#  certbot certonly --standalone --non-interactive -d ${SERVER_HOSTNAME} 2>&1 | tee -a ${LOG} || OK=0
#  if [ ${OK} -ne 1 ] ; then
#    echo 1>&2 " *** Error creating Certbot certificate: $(cat ${LOG})"
#    exit 1
#  fi
#else
#  echo 1>&2 "Certbot not enabled. Please put a proper HTTPS-enabled web server in front of this!"
#fi
#
#echo 1>&2 " *** Starting redis..."
#redis-server &
#
#echo 1>&2 " *** Starting nginx..."
#nginx

echo 1>&2 " *** Starting nuxt..."
yarn start
