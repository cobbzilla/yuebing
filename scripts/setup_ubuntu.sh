#!/bin/bash

THIS_USER="$(whoami)"

sudo apt update && \
  sudo apt upgrade -y && \
  sudo apt install apt-transport-https ca-certificates curl software-properties-common && \
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
  sudo apt update && \
  sudo apt install docker-ce -y && \
  sudo -E usermod -aG docker "${THIS_USER}" && \
docker run -it cobbzilla/yuebing
