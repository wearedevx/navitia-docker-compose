FROM debian:8
# this is the first version, if this work, this should be pushed in docker_hub

RUN apt update \
    && apt install -y \
    wget \
    unzip \
    git \
    python-dev \
    python-pip \
    libgeos-c1 \
    && wget https://ci.navitia.io/job/navitia_release/lastSuccessfulBuild/artifact/*zip*/archive.zip \
    && unzip archive.zip -d /tmp/navitia_dpkg

RUN dpkg -i \
    /tmp/navitia_dpkg/archive/navitia-common_*.deb \
    /tmp/navitia_dpkg/archive/navitia-ed_*.deb \
    /tmp/navitia_dpkg/archive/navitia-tyr_*.deb \
    || apt install --fix-broken -y

RUN pip install -r /usr/share/tyr/requirements.txt

COPY settings.py /

# TODO change the user to remove this ugly C_FORCE_ROOT
CMD TYR_CONFIG_FILE=/settings.py C_FORCE_ROOT=1 celery worker -A tyr.tasks
