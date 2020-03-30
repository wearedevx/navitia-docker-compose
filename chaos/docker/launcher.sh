#!/bin/bash

set -e

echo -n "Waiting for postgres and rabbitmq containers to be reachables..."
until nc -z chaos_database 5432 &&  nc -z rabbitmq 5672
do
    echo -n "."
    sleep 0.5
done
echo

honcho run ./manage.py db upgrade

uwsgi --mount /=chaos:app --http 0.0.0.0:$PORT