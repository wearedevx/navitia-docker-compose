# Docker image used to build and run navitia's test
FROM debian:8

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
                git \
                g++ \
                cmake \
                libboost-all-dev \
                libzmq3-dev \
                libosmpbf-dev \
                libboost-all-dev \
                libpqxx3-dev \
                libgoogle-perftools-dev \
                libprotobuf-dev \
                libproj-dev \
                protobuf-compiler \
                libgeos-c1 \
                liblog4cplus-dev \
                rabbitmq-server \
                python-pip && \
    pip install -U pip

RUN mkdir -p /work/build
WORKDIR /work

VOLUME /work/navitia

ENV NB_THREAD $(nproc)

COPY build.sh build.sh

CMD ["./build.sh"]