#!/bin/bash

set -e

git pull && git submodule update --init && make -j$(nproc) kraken ed_executables

docker build -t jormungandr -f  Dockerfile-jormungandr .

docker build -t kraken -f Dockerfile-kraken .

docker build -t tyr-beat -f Dockerfile-tyr-beat .
docker build -t tyr-worker -f Dockerfile-tyr-worker .
docker build -t tyr-web -f Dockerfile-tyr-web .
