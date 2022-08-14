#!/bin/bash

sudo apt update && sudo apt upgrade -y && sudo apt install -y docker.io docker-compose git && \
git clone https://github.com/cobbzilla/yuebing.git && \
cd yuebing && docker-compose build && \
docker-compose up -d
