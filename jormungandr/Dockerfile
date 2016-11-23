FROM python:2.7-alpine

# we need geos and for the moment it's only on edge
RUN sed -i -e 's/v3\../edge/g' /etc/apk/repositories \
    && echo http://dl-3.alpinelinux.org/alpine/edge/testing  >> /etc/apk/repositories \
    && apk upgrade --update-cache --available

RUN apk --update --no-cache add \
        git \
        postgresql-dev \
        gcc \
        geos \
        protobuf \
        && \
    git clone https://github.com/CanalTP/navitia /srv/navitia \
    && cd /srv/navitia \
    && sed -i 's,git\@github.com:\([^/]*\)/\(.*\).git,https://github.com/\1/\2,' .gitmodules \
    && git submodule update --init

WORKDIR /srv/navitia/source/jormungandr/

RUN cd ../navitia-proto && protoc --python_out=/srv/navitia/source/navitiacommon/navitiacommon request.proto response.proto type.proto stat.proto && cd -


RUN apk --update add \
        g++ \
        python-dev

RUN pip install --no-cache-dir -r requirements.txt

# TODO hangle this __version better
RUN echo "__version__ = 'unkown_version'" > jormungandr/_version.py

COPY settings.py /srv/navitia

CMD JORMUNGANDR_CONFIG_FILE=/srv/navitia/settings.py PYTHONPATH=.:../navitiacommon python "jormungandr/manage.py" runserver -r -t 0.0.0.0 -p 80
