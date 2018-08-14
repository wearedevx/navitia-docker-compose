#!/bin/bash

function show_help() {
    cat << EOF
Usage: ${0##*/} [-lr] [-b branch] [-u user] [-p password]
    -b      git branch to build
    -l      tag images as lastest
    -r      push images to a registry
    -u      username for authentication on registry
    -p      password for authentication on registry
    -n      does not update the sources (if the sources have been provided by volume for example)
    -i      number of processors to ignore while compiling
EOF
}

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

branch=dev
tag_latest=0
push=0
user=''
password=''
components='jormungandr kraken tyr-beat tyr-worker tyr-web instances-configurator mock-kraken'
navitia_local=0
nb_procs_to_ignore=0

while getopts "lrnb:u:p:i:" opt; do
    case $opt in
        b)
            branch=$OPTARG
            ;;
        p)
            password=$OPTARG
            ;;
        u)
            user=$OPTARG
            ;;
        n)
            navitia_local=1
            ;;
        l)
            tag_latest=1
            ;;
        r)
            push=1
            ;;
        i)
            nb_procs_to_ignore=$OPTARG
            ;;
        h|\?)
            show_help
            exit 1
            ;;
    esac
done

set -e

#build_dir=/build
navitia_dir=$(pwd)/navitia

if [ $navitia_local -eq 1 ]; then
    echo "Using navitia local path, no update"
else
    echo "building branch $branch"
    pushd $navitia_dir
    run git checkout $branch && git fetch origin && git pull origin $branch && git submodule update --init --recursive
    popd
fi

TARGETS="protobuf_files kraken ed_executables basic_routing_test basic_schedule_test departure_board_test"
TARGETS="$TARGETS empty_routing_test line_sections_test main_autocomplete_test main_ptref_test main_routing_test"
TARGETS="$TARGETS main_routing_without_pt_test main_stif_test multiple_schedules null_status_test timezone_cape_verde_test cities"

run cmake -DCMAKE_BUILD_TYPE=Release $navitia_dir/source
run make -j$(nproc) $TARGETS

strip --strip-unneeded tests/*_test kraken/kraken ed/*2ed cities/cities ed/ed2nav

pushd $navitia_dir
version=$(git describe)
echo "building version $version"
popd

for component in $components; do
    run docker build -t navitia/$component:$version -f  Dockerfile-$component .
        docker tag navitia/$component:$version navitia/$component:$branch
    if [ $tag_latest -eq 1 ]; then
        docker tag navitia/$component:$version navitia/$component:latest
    fi
done

if [ $push -eq 1 ]; then
    if [ -n $user ]; then docker login -u $user -p $password; fi
    for component in $components; do
        docker push navitia/$component:$version
        docker push navitia/$component:$branch
    if [ $tag_latest -eq 1 ]; then
        docker push navitia/$component:latest
    fi
    done
    if [ -n $user ]; then docker logout; fi
fi

