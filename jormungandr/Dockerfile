FROM python:2.7-alpine



RUN apk --update add \
        git \
        postgresql-dev \
        gcc \
        && \
    git clone https://github.com/CanalTP/navitia /srv/navitia 

WORKDIR /srv/navitia/source/jormungandr/


RUN apk --update add \
        python-dev

RUN pip install --no-cache-dir -r requirements.txt
# those are needed for uwsgi
#RUN apk --update add \
#        g++ \
#        build-base \
#        python-dev \
#        zlib-dev \
#        linux-headers \
#        musl \
#        musl-dev \
#        memcached \
#        libmemcached-dev && \
#    pip install --no-cache-dir -r requirements.txt && \
#    apk del \
#        g++ \
#        build-base \
#        python-dev \
#        zlib-dev \
#        linux-headers \
#        musl \
#        musl-dev \
#        memcached \
#        libmemcached-dev && \
#    rm -rf /var/apk/cache/*

CMD 'python "/jormungandr/manage.py" runserver -r -t 0.0.0.0 -p 80' 
