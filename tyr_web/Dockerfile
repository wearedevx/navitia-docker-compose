FROM python:2.7-alpine

# we need geos and for the moment it's only on edge
RUN sed -i -e 's/v3\../edge/g' /etc/apk/repositories \
    && echo http://dl-3.alpinelinux.org/alpine/edge/testing  >> /etc/apk/repositories \
    && apk upgrade --update-cache --available

RUN apk --update add \
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

WORKDIR /srv/navitia/source/tyr/

RUN cd ../navitia-proto && protoc --python_out=/srv/navitia/source/navitiacommon/navitiacommon task.proto && cd -

RUN apk --update add \
        musl-dev \
        python-dev
        RUN pip install --no-cache-dir -r requirements.txt

COPY settings.py /srv/navitia

CMD TYR_CONFIG_FILE=/srv/navitia/settings.py PYTHONPATH=.:../navitiacommon python ./manage_tyr.py runserver -r -t 0.0.0.0 -p 80
