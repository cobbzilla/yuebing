#!/bin/bash

THIS_USER="$(whoami)"

sudo apt update && sudo apt upgrade -y && sudo apt install -y docker.io git && \
sudo -E usermod -aG docker "${THIS_USER}" && \
git clone https://github.com/cobbzilla/yuebing.git && \
cd yuebing && \
yarn install && \
yarn docker-build-dev && \
yarn docker-run-dev
