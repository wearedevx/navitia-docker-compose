FROM debian:jessie

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get -yq install \
  wget \
  python-pip \
  libpq5 \
  libprotobuf9 \
  libpython2.7 \
  netcat \
  && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /srv/chaos

RUN set -xe && \
  apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get -yq install \
  libpq-dev \
  python-dev \
  protobuf-compiler \
  git \
  && \
  git clone https://github.com/CanalTP/Chaos.git .

COPY ./.gitmodules ./.gitmodules

RUN pip install uwsgi -i https://pypi.python.org/simple/ && \
  pip install --upgrade 'setuptools<45' pip && \
  pip install -r requirements.txt -i https://pypi.python.org/simple/ && \
  pip install honcho && \
  git submodule init && git submodule update && \
  python setup.py build_pbf

RUN apt-get purge -y --auto-remove \
  -o APT::AutoRemove::RecommendsImportant=false \
  -o APT::AutoRemove::SuggestsImportant=false \
  libpq-dev \
  python-dev \
  protobuf-compiler \
  && \
  rm -rf /var/lib/apt/lists/*

EXPOSE 5001

ENV CHAOS_CONFIG_FILE=default_settings.py
ENV PYTHONPATH=.
ENV PORT=5001

COPY ./docker/launcher.sh ./launcher.sh

CMD ["bash", "./launcher.sh"]