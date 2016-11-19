FROM debian:8
# this is the first version, if this work, this should be pushed in docker_hub

RUN apt update \
    && apt install -y wget unzip \
    && wget https://ci.navitia.io/job/navitia_release/lastSuccessfulBuild/artifact/*zip*/archive.zip \
    && unzip archive.zip -d /tmp/navitia_dpkg

RUN dpkg -i /tmp/navitia_dpkg/archive/navitia-kraken_*.deb \
    || apt install --fix-broken -y

COPY kraken.ini /srv/navitia/

CMD /usr/bin/kraken /srv/navitia/kraken.ini
