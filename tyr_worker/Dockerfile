FROM debian:8
# this is the first version, if this work, this should be pushed in docker_hub

RUN apt update \
    && apt install -y wget unzip \
    && wget https://ci.navitia.io/job/navitia_release/lastSuccessfulBuild/artifact/*zip*/archive.zip \
    && unzip archive.zip -d /tmp/navitia_dpkg

RUN dpkg -i \
    /tmp/navitia_dpkg/archive/navitia-common_*.deb \
    /tmp/navitia_dpkg/archive/navitia-ed_*.deb \
    /tmp/navitia_dpkg/archive/navitia-tyr__*.deb \
    || apt install --fix-broken -y

RUN apt install -y python-pip && \
    pip install -r /usr/share/tyr/requirements.txt

CMD celery worker -A tyr.tasks
