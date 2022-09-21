#!/bin/bash

function die {
  echo 1>&2 "${1}"
  exit 1
}

THIS_USER="$(whoami)"
LE_EMAIL="${1}"
LE_HOSTNAME=${2:-$YB_HOSTNAME}

# Use another volume for large files
MOUNT_PATH="${3:-/data}"
MOUNT_DEVICE="${4:-/dev/xvdf}"
MOVE_DOCKER_TO_MOUNT="${5:-YES}"

if [[ -n "${LE_EMAIL}" && -n "${LE_HOSTNAME}" ]] ; then
  sudo hostname "${LE_HOSTNAME}" && \
  sudo bash -c "echo -n \"${LE_HOSTNAME}\" > /etc/hostname" || die 'Error setting hostname'
fi

sudo bash -c 'DEBIAN_FRONTEND=noninteractive apt-get -y update' && \
  sudo bash -c 'DEBIAN_FRONTEND=noninteractive apt-get -y upgrade' && \
  sudo bash -c 'DEBIAN_FRONTEND=noninteractive apt install apt-transport-https ca-certificates curl software-properties-common -y' || \
  die 'Error updating/upgrading/installing basics'

DOCKER_GPG_FILE=/usr/share/keyrings/docker-archive-keyring.gpg
if [[ ! -f "${DOCKER_GPG_FILE}" ]] ; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o ${DOCKER_GPG_FILE} && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    sudo bash -c 'DEBIAN_FRONTEND=noninteractive apt-get -y update' && \
    sudo bash -c 'DEBIAN_FRONTEND=noninteractive apt install docker-ce -y' && \
    sudo -E usermod -aG docker "${THIS_USER}" || \
    die 'Error installing docker'
fi

if [[ -n "${LE_EMAIL}" && -n "${LE_HOSTNAME}" ]] ; then
  sudo bash -c 'DEBIAN_FRONTEND=noninteractive apt install certbot -y' || die 'Error installing certbot'
  if [[ $(sudo bash -c "find /etc/letsencrypt/accounts -type f -name regr.json | wc -l | tr -d ' '") -eq 0 ]] ; then
    echo "certbot register starting: certbot register --agree-tos -m ${LE_EMAIL} --non-interactive"
    sudo bash -c 'certbot register --agree-tos -m '"${LE_EMAIL}"' --non-interactive' || die 'Error registering certbot'
  fi
  CERT_FILE=/etc/letsencrypt/live/"${LE_HOSTNAME}"/privkey.pem
  if [[ $(sudo bash -c 'ls -l "'"${CERT_FILE}"'"' 2> /dev/null | wc -l | tr -d ' ') -gt 0 ]] ; then
    echo "cert exists: ${CERT_FILE}"
  else
    sudo bash -c 'certbot certonly --standalone -d '"${LE_HOSTNAME}" || die "Error getting cert for ${LE_HOSTNAME}"
  fi
fi

if [[ -n "${MOUNT_PATH}" ]] ; then
  sudo mkdir -p "${MOUNT_PATH}" || die "Error creating mount dir ${MOUNT_PATH}"
  sudo mount "${MOUNT_DEVICE}" "${MOUNT_PATH}" || \
    sudo mkfs -t xfs "${MOUNT_DEVICE}" && \
    sudo mount "${MOUNT_DEVICE}" "${MOUNT_PATH}" || \
    die "Error creating/mounting device ${MOUNT_DEVICE} to path ${MOUNT_PATH}"
  if [[ "${MOVE_DOCKER_TO_MOUNT}" != "NO" ]] ; then
    sudo mkdir -p "${MOUNT_PATH}"/docker || die "Error creating dir ${MOUNT_PATH}/docker"
    sudo mkdir -p /etc/docker || die "Error ensuring /etc/docker exists"
    sudo service docker stop || die "Error stopping docker"
    sudo bash -c 'echo "{\"data-root\": \"'"${MOUNT_PATH}"'/docker\"}" > /etc/docker/daemon.json' || die "Error writing /etc/docker/daemon.json"
    sudo service docker start || die "Error starting docker"
  fi
fi

exec sudo -u "${THIS_USER}" docker run -it cobbzilla/yuebing
