FROM python:2.7-alpine


RUN apk --update add \
        git \
        postgresql-dev \
        gcc \
        && \
    git clone https://github.com/CanalTP/navitia /srv/navitia 

WORKDIR /srv/navitia/source/tyr/

RUN apk --update add \
        musl-dev \
        python-dev

RUN pip install --no-cache-dir -r requirements.txt


CMD 'celery beat -A tyr.tasks'
