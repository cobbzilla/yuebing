#!/bin/bash

THIS_USER="$(whoami)"

sudo apt update && sudo apt upgrade -y && sudo apt install -y docker.io && \
sudo -E usermod -aG docker "${THIS_USER}" && \
docker run -it cobbzilla/yuebing
