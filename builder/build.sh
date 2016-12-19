#!/bin/bash

#we want to be able to interupt the build, see: http://veithen.github.io/2014/11/16/sigterm-propagation.html
function run() {
    trap 'kill -TERM $PID' TERM INT
    $@ &
    PID=$!
    wait $PID
    trap - TERM INT
    wait $PID
    return $?
}

set -e

branch=$1

run cmake -DCMAKE_BUILD_TYPE=Release source
run git pull && git checkout $branch && git submodule update --init
run make -j$(nproc) kraken ed_executables

run docker build -t jormungandr -f  Dockerfile-jormungandr .

run docker build -t kraken -f Dockerfile-kraken .

run docker build -t tyr-beat -f Dockerfile-tyr-beat .
run docker build -t tyr-worker -f Dockerfile-tyr-worker .
run docker build -t tyr-web -f Dockerfile-tyr-web .
