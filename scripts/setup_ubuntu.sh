#!/bin/bash

THIS_USER="$(whoami)"
LE_EMAIL="${1}"
LE_HOSTNAME=${2:-$YB_HOSTNAME}

sudo apt update && \
  sudo apt upgrade -y && \
  sudo apt install apt-transport-https ca-certificates curl software-properties-common -y && \
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
  sudo apt update && \
  sudo apt install docker-ce -y && \
  sudo -E usermod -aG docker "${THIS_USER}"

if [[ -n "${LE_EMAIL}" && -n "${LE_HOSTNAME}" ]] ; then
  sudo apt install certbot -y
  if [[ $(find /etc/letsencrypt/accounts -type f -name regr.json | xargs grep -l "${LE_EMAIL}" | wc -l | tr -d ' ') -eq 0 ]] ; then
    echo "certbot register starting: certbot register --agree-tos -m ${LE_EMAIL} --non-interactive"
    certbot register --agree-tos -m "${LE_EMAIL}" --non-interactive
    OK=$?
    echo "certbot register completed, OK=${OK}"
    if [[ ${OK} -ne 0 ]] ; then
      exit
    fi
  fi
  CERT_FILE=/etc/letsencrypt/live/"${LE_HOSTNAME}"/privkey.pem
  if [[ -f "${CERT_FILE}" ]] ; then
    echo "cert exists: ${CERT_FILE}"
  else
    certbot certonly --standalone -d "${LE_HOSTNAME}"
  fi
fi

sudo -u "${THIS_USER}" docker run -it cobbzilla/yuebing
